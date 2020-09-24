'use strict';

const stripe = require('stripe')(sails.config.custom.stripe.apiKey);
stripe.setApiVersion(sails.config.custom.stripe.apiVer);

function switchToProspect (client) {
  return new Promise((resolve, reject) => {
    Client.update({ id: client.id })
      .set({ tag: 'Prospect' })
      .then(() => TaskService.generateProspectTask(client.user.email))
      .then(resolve)
      .catch(reject);
  });
}

function switchToPaying (client) {
  return new Promise((resolve, reject) => {
    Task.find({ user: client.user.email, done: false })
      .then(_success => {
        if(_success.length > 0) return reject(403);

        return Client.update({ id: client.id }).set({ tag: 'Paying' });
      })
      .then(() => {
        return Task.destroy({ user: client.user.email });
      })
      .then(resolve)
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function mergeProspectTasks (clients) {
  return new Promise((resolve, reject) => {
    async.each(clients, (client, next) => {
      Task.find({ user: client.user.email })
        .then(_tasks => {
          client.tasks = _tasks;

          next();
        })
        .catch(next);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(clients);
    });
  });
}

function lessThanDay (date) {
  if(new Date(date).getTime() - new Date().getTime() <= sails.config.custom.timestamps.day) return true;
  else return false;
}

function refoundForCustomEvent (training, client) {
  return new Promise((resolve, reject) => {
    if(!lessThanDay(training.date)) {
      Order.find({ where: { clientId: client.id, trainingId: training.id }, sort: 'id DESC' }).limit(1)
        .then(_order => {
          _order = _order[0];
          if(!_order) return reject(404);

          ChargeService.refund(_order.chargeId)
            .then(_refund => {
              if(!_refund) return reject(400);
              // TODO: Add email notification
              // return EmailService.refund(DATA);
              return resolve();
            })
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    } else {
      return resolve();
    }
  });
}

function removeFromGroupEvent (training, client) {
  return new Promise(function (resolve, reject) {
    Schedule.destroy({ trainingId: training.id, clientId: client.id })
      .then(() => {
        return Training.removeFromCollection(training.id, 'clients').members([ client.id ]);
      })
      .then(() => resolve())
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function requirePay (training, client, cardToken) {
  return new Promise((resolve, reject) => {
    if(training.cost > 0) {
      ChargeService.charge({
        amount: training.cost,
        description: `${training.name} ${new Date(training.date).toDateString()}`
      }, client, cardToken)
        .then(_charge => {
          if(!_charge) return reject(400);

          return OrderService.createCustom({
            name: training.name,
            cost: training.cost,
            clientId: client.id,
            chargeId: _charge.id,
            trainingId: training.id
          });
        })
        .then(resolve)
        .catch(reject);
    } else {
      return resolve();
    }
  });
}

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      Client.create({
        user: data.user,
        gender: data.gender,
        phone: data.phone,
        birth: data.birth,
        trainerId: data.trainerId,
        buildingId: data.buildingId,
        tag: data.tag,
        newsletter: data.newsletter,
        notification: data.notification,
        fromFacebook: data.fromFacebook,
        street: data.street,
        apartment: data.apartment,
        zipCode: data.zipCode,
      })
        .meta({ fetch: true })
        .then(_client => {
          CustomerStripeService.create(_client.id, { email: data.user, firstName: data.firstName, lastName: data.lastName })
            .then(_client => {

              if(_client.tag === 'Prospect') {
                TaskService.generateProspectTask(_client.user)
                  .then(() => {

                    return Promise.all([
                      Client.findOne({ user: _client.user }).populateAll(),
                      Administrator.find().limit(1)
                    ]);
                  })
                  .then(([ _populatedClient, _admin ]) => EmailService.newClient({ admin: _admin[0], client: _populatedClient }))
                  .then(() => {
                    if(data.isActive) return EmailService.sendActivationStaff(data.user);
                    return EmailService.sendActivation(data.user);
                  })
                  .then(() => resolve(_client))
                  .catch(reject);
              } else {
                Promise.all([
                  Client.findOne({ user: _client.user }).populateAll(),
                  Administrator.find().limit(1)
                ])
                  .then(([ _populatedClient, _admin ]) => EmailService.newClient({ admin: _admin[0], client: _populatedClient }))
                  .then(() => {
                    if(data.isActive) return EmailService.sendActivationStaff(data.user);
                    return EmailService.sendActivation(data.user);
                  })
                  .then(() => resolve(_client))
                  .catch(reject);
              }
            })
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
      BuildingService.findOneByCode(data.code)
        .then(_building => {
          if(_building && _building.active) data.buildingId = _building.id;

          Client.update({ id: data.id })
            .set(data)
            .meta({ fetch: true })
            .then(_client =>  {
              return Client.findOne({ id: _client[0].id })
                .populate('buildingId')
                .populate('trainerId');
            })
            .then(resolve)
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
        .catch(reject);
    });
  },

  updateByClient (data, role, req) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.id })
        .then(_user => {
          if(!_user) return reject(404);

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);

          data.id = _client.id;

          UserService.update(data, role, req)
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
      Client.findOne({ id: data, deleted: false })
        .populateAll()
        .then(_client => {
          if(!_client) return reject(404);
          return resolve(_client);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  destroy (id) {
    return new Promise((resolve, reject) => {
      let _client;
      User.findOne({ id: id })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };
          return Client.findOne({ user: user.email });
        })
        .then(client => {
          if(!client) throw { errCode: 404, message: 'Client not found' };
          _client = client;
          return User.update({ id: id }, {
            email: `client@${id}.com`,
            firstName: 'User deleted',
            lastName: 'User deleted',
            password: 'czxawzvcvsdsca21312321',
            avatar: 'avatar.png'
          });
        })
        .then(() => Client.update({ id: _client.id }, {
          user: `client@${id}.com`,
          customerId: 'User deleted',
          creditCardId: 'User deleted',
          trainerId: null,
          buildingId: null,
          gender: 'User deleted',
          apartment: 'User deleted',
          zipCode: 'User deleted',
          phone: 0,
          birth: 0,
          deleted: true,
        }))
        .then(() => Invoice.update({ user: _client.user }, { user: `client@${id}.com` }))
        .then(() => Maintainance.update({ issuedBy: _client.user }, { issuedBy: `client@${id}.com` }))
        .then(() => Notification.update({ issuedTo: _client.user }, { issuedTo: `client@${id}.com` }))
        .then(resolve)
        .catch(reject);
    });
  },

  destroyByPropertyManager (id, userID) {
    return new Promise((resolve, reject) => {
      let _propManager;
      User.findOne({ id: userID })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };
          return PropertyManager.findOne({ user: user.email });
        })
        .then(propManager => {
          if(!propManager) throw { errCode: 404, message: 'PropertyManager not found' };
          _propManager = propManager;

          return User.findOne({ id: id });
        })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };

          return Client.findOne({ user: user.email, buildingId: _propManager.buildingId });
        })
        .then(client => {
          if(!client) throw { errCode: 404, message: 'Client not found' };

          return this.destroy(id);
        })
        .then(resolve)
        .catch(reject);
    });
  },

  find (data) {
    return new Promise((resolve, reject) => {
      const criteria = {
        skip: data.start || 0,
        limit: data.end || 0
      };

      if(data.query !== '' && data.query !== undefined) {
        criteria.where = {};
        criteria.where.or = [
          { email: { contains: data.query } },
          { firstName: { contains: data.query } },
          { lastName: { contains: data.query } }
        ];
        criteria.where.role = 'Client';

        User.find(criteria)
          .then(users => {
            const emails = users.map(u => u.email);

            return Client.find({ user: emails, deleted: false }).populateAll();
          })
          .then(resolve)
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
      } else {
        if(data.buildingId !== 0 || data.trainerId !== 0) {
          criteria.where = { deleted: false };
          criteria.sort = 'id DESC';

          if(data.buildingId && (!isNaN(data.buildingId)) && (data.buildingId > 0))
            criteria.where.buildingId = data.buildingId;
          else if(data.trainerId && (!isNaN(data.trainerId)) && (data.trainerId > 0))
            criteria.where.trainerId = data.trainerId;
        }

        Client.find(criteria)
          .populateAll()
          .then(resolve)
          .catch(reject);
      }
    });
  },

  findByPropertyManager ({ start, end, userID, query }) {
    return new Promise((resolve, reject) => {
      let buildingId;
      User.findOne({ id: userID })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };

          return PropertyManager.findOne({ user: _user.email });
        })
        .then(_propertyManager => {
          if(!_propertyManager) throw { errCode: 404, message: 'You are not property manager' };
          buildingId = _propertyManager.buildingId;

          return this.find({
            query,
            buildingId,
            start,
            end,
          });
        })
        .then(_clients => {
          const tmp = [];
          for (let client of _clients) {
            if(client.buildingId && client.buildingId.id === buildingId) tmp.push(client);
          }
          return tmp;
        })
        .then(resolve)
        .catch(reject);
    });
  },

  findProspects () {
    return new Promise((resolve, reject) => {
      Client.find({ where: { tag: 'Prospect' }, sort: 'id DESC' })
        .populateAll()
        .then(_clients => {
          mergeProspectTasks(_clients)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findByTrainer ({ userID, query, start, end }) {
    return new Promise((resolve, reject) => {
      let trainerId;
      User.findOne({ id: userID })
        .then(_user => {
          if(!_user) return reject({ errCode: 404, message: 'User not found' });

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) return reject({ errCode: 404, message: 'Trainer not found' });
          trainerId = _trainer.id;

          return this.find({
            query,
            trainerId,
            start,
            end
          });
        })
        .then(_clients => {
          const tmp = [];
          for (let client of _clients) {
            if(client.trainerId && client.trainerId.id === trainerId) tmp.push(client);
          }
          return tmp;
        })
        .then(resolve)
        .catch(reject);
    });
  },

  joinToTraining (trainingID, client, cardToken) {
    return new Promise((resolve, reject) => {
      Training.findOne({ id: trainingID, date: { '>': Date.now() + sails.config.custom.timestamps.tenMinutes } })
        .populate('clients')
        .then(_training => {

          if(!_training) throw { errCode: 404, message: 'Can not find that training in feature' };
          if(_training.clients.length === _training.capacity) throw { errCode: 403, message: 'There are no available places to join in' };

          Schedule.findOne({ clientId: client.id, trainingId: trainingID })
            .then(_schedule => {
              if(_schedule) return reject({ errCode: 409, message: 'You are already signed' }); // if client already signed return conflict

              requirePay(_training, client, cardToken)
                .then(() => {

                  Training.addToCollection(trainingID, 'clients')
                    .members([ client.id ])
                    .then(() => {

                      Training.findOne({ id: trainingID })
                        .populateAll()
                        .then(_training => {
                          ScheduleService.create({
                            clientId: client.id,
                            date: _training.date,
                            trainingId: _training.id
                          })
                            .then(() => resolve(_training))
                            .catch(reject);
                        })
                        .catch(reject);
                    })
                    .catch(reject);
                })
                .catch(reject);

            })
            .catch(reject);
        })
        .catch(reject);
    });
  },

  signedOutFromTraining (trainingID, client) {
    return new Promise((resolve, reject) => {
      Training.findOne({ id: trainingID, date:{ '>=': Date.now() + sails.config.custom.timestamps.tenMinutes } })
        .populateAll()
        .then(_training => {
          if(!_training) return reject(404);

          if((!_training.mainClient) || (_training.mainClient.id !== client.id)) { //if group
            if(_training.cost > 0) {
              refoundForCustomEvent(_training, client)
                .then(() => {
                  return removeFromGroupEvent(_training, client);
                })
                .then(resolve)
                .catch(reject);
            } else {
              removeFromGroupEvent(_training, client)
                .then(resolve)
                .catch(reject);
            }
          } else { //if personal

            if(lessThanDay(_training.date)) {
              ChargeService.chargeForTraining({ client: client, productName: _training.type.name, duration: _training.duration })
                .then(() => {
                  return TrainingService.destroy(_training);
                })
                .then(() => {
                  return EmailService.notifiCanceledTraining(_training, [ _training.trainerId.user, ...(_training.clients.map(item => item.user)) ]);
                })
                .then(() => resolve())
                .catch(reject);
            } else {
              TrainingService.destroy(_training)
                .then(() => {
                  return EmailService.notifiCanceledTraining(_training, [ _training.trainerId.user, ...(_training.clients.map(item => item.user)) ]);
                })
                .then(() => resolve())
                .catch(reject);
            }
          }
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

          Client.findOne({ user: _user.email })
            .populateAll()
            .then(_client => {
              if(!_client) return reject(404);

              return resolve(_client);
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
  },

  switchTag (userId, permission) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject(404);

          return Client.findOne({ user: _user.email }).populateAll();
        })
        .then(_client => {
          if(!_client) return reject(404);
          if(_client.tag === 'Prospect' &&  permission <= 1 && _client.trainerId)  {
            switchToPaying(_client)
              .then(resolve)
              .catch(reject);
          } else if(_client.tag === 'Freemium' &&  permission === 4) { // allow only `Freemium` client for switch to Prospect
            switchToProspect(_client)
              .then(resolve)
              .catch(reject);
          } else {
            return reject(403);
          }
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  saveCreditCard (data) {
    return new Promise((resolve, reject) => {
      Client.findOne({ id: data.clientId })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: 'Client not found' };

          stripe.customers.createSource(_client.customerId,{ source: data.token }, (err, card) => {
            if(err) return reject({ errCode: 'stripe', message: err });

            Client.update({ id: data.clientId })
              .set({ creditCardId: card.id })
              .then(resolve)
              .catch(reject);
          });
        })
        .catch(reject);
    });
  },

  deleteCreditCard (clientId) {
    return new Promise((resolve, reject) => {
      Client.findOne({ id: clientId })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: 'Client not found' };

          stripe.customers.deleteCard(_client.customerId, _client.creditCardId, (err) => {
            if(err) return reject({ errCode: 'stripe', message: err });

            Client.update({ id: clientId })
              .set({ creditCardId: '' })
              .then(resolve)
              .catch(reject);
          });
        })
        .catch(reject);
    });
  }
};
