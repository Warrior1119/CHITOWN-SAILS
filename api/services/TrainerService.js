'use strict';

function attachTrainerClients (trainer) {
  return new Promise((resolve, reject) => {
    Client.find({ trainerId: trainer.id })
      .populate('user')
      .then(_clients => {

        trainer.clients = _clients;
        return resolve(trainer);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function addServices (trainer, services) {
  return new Promise((resolve, reject) => {
    async.each(services, (service, next) => {
      TrainingType.findOne({ name: service.serviceId })
        .then(_item => {
          if(!_item) return reject({ errCode: 404, message: `Event type ${service.serviceId} not found` });

          return ServiceTrainer.create({
            trainerId: trainer.id,
            serviceId: service.serviceId,
            fee: service.fee,
            percentage: service.percentage
          });
        })
        .then(next)
        .catch(err => next(err));
    }, err => {
      if(err) return reject(err);

      return resolve();
    });
  });
}

function updateServices (trainer, services) {
  return new Promise((resolve, reject) => {
    ServiceTrainer.destroy({ trainerId: trainer.id })
      .then(() => {
        addServices(trainer, services)
          .then(resolve)
          .catch(reject);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function getServices (trainerId) {
  return new Promise((resolve, reject) => {
    ServiceTrainer.find({ trainerId: trainerId })
      .populateAll()
      .then(resolve)
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      const services = data.services;

      Trainer.create({ user: data.user, gender: data.gender, phone: data.phone })
        .meta({ fetch: true })
        .then(_trainer => {
          addServices(_trainer, services)
            .then(() => {
              return getServices(_trainer.id);
            })
            .then(_services => {
              _trainer.services = _services;
              return EmailService.sendActivationStaff(_trainer.user);
            })
            .then(() => resolve(_trainer))
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  update (data) {
    return new Promise((resolve, reject) => {
      const services = data.services;
      delete data.services;

      Trainer.update({ id: data.id })
        .set(data)
        .meta({ fetch: true })
        .then(_trainer =>  {
          if(services && services.length > 0) {
            updateServices(_trainer[0], services)
              .then(() => {
                ServiceTrainer.find({ trainerId: _trainer[0].id })
                  .populateAll()
                  .then(_services => {
                    _trainer[0].services = _services;

                    return resolve(_trainer[0]);
                  })
                  .catch(err => {
                    sails.log.error(err);
                    return reject();
                  });
              })
              .catch(reject);
          } else {
            return resolve(_trainer[0]);
          }
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  updateByTrainer (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.id })
        .then(_user => {
          if(!_user) return reject(404);

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) return reject(404);

          data.id = _trainer.id;
          this.update(data)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOne (data) {
    return new Promise((resolve, reject) => {
      Trainer.findOne({ id: data })
        .populateAll()
        .then(_trainer => {
          if(!_trainer) return reject(404);

          attachTrainerClients(_trainer)
            .then(_trainer => {
              return getServices(_trainer.id);
            })
            .then(_services => {
              _trainer.services = _services;

              return resolve(_trainer);
            })
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find () {
    return new Promise((resolve, reject) => {
      Trainer.find()
        .populateAll()
        .then(_trainers => {
          async.each(_trainers, (trainer, next) => {
            attachTrainerClients(trainer)
              .then(() => {
                return getServices(trainer.id);
              })
              .then(_services => {
                trainer.services = _services;
                next();
              })
              .catch(next);
          }, err => {
            if(err) {
              sails.log.error(err);
              return reject();
            }

            return resolve(_trainers);
          });
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  getDashboard (userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject(404);

          Trainer.findOne({ user: _user.email })
            .populateAll()
            .then(_trainer => {
              if(!_trainer) return reject(404);

              attachTrainerClients(_trainer)
                .then(_trainer => {
                  getServices(_trainer.id)
                    .then(_services => {
                      _trainer.services = _services;
                      return resolve(_trainer);
                    })
                    .catch(reject);
                })
                .catch(reject);
            })
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
