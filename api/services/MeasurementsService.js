'use strict';

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      Measurements.create(data).meta({ fetch: true })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  createByManager (data) {
    return new Promise((resolve, reject) => {
      Client.findOne({ id: data.clientId })
        .then(_client => {
          if(!_client) return reject(404);

          this.create(data)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  createByClient (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);

          delete data.userID;

          data.clientId = _client.id;
          this.create(data)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  createByTrainer (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) return reject(404);

          return Client.findOne({ id: data.clientId, trainerId: _trainer.id }); // check if user was assigned to trainer
        })
        .then(_client => {
          if(!_client) return reject(403); // Trainer can update measurements only for ur clients

          delete data.userID;

          this.create(data)
            .then(resolve)
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
      Measurements.update({ id: data.id }).set(data).meta({ fetch: true })
        .then(_measurement => resolve(_measurement[0]))
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  updateByClient (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);

          return Measurements.findOne({ id: data.id, clientId: _client.id });
        })
        .then(_measurement => {
          if(!_measurement) return reject(403);

          delete data.userID;
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

  updateByTrainer (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) return reject(404);

          Measurements.findOne({ id: data.id })
            .then(_measurement => {
              if(!_measurement) return reject(404);

              return Client.findOne({ id: _measurement.clientId, trainerId: _trainer.id }); // check if user was assigned to trainer
            })
            .then(_client => {
              if(!_client) return reject(403); // Trainer can update measurements only for ur clients

              delete data.userID;

              this.update(data)
                .then(resolve)
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
  },

  find (data) {
    return new Promise((resolve, reject) => {
      Measurements.find({
        where: {
          clientId: data.clientId,
          createdAt: { '>=': data.start, '<=': data.end }
        },
        sort: 'id DESC'
      })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findByClient (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);

          data.clientId = _client.id;
          this.find(data)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
