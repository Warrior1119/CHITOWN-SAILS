'use strict';

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      Manager.create({
        user: data.user,
      })
        .meta({ fetch: true })
        .then(_manager => {
          EmailService.sendActivationStaff(_manager.user)
            .then(() => resolve(_manager))
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
      Manager.update({ id: data.id })
        .set(data)
        .meta({ fetch: true })
        .then(_manager => resolve(_manager[0]))
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOne (data) {
    return new Promise((resolve, reject) => {
      Manager.findOne({ id: data })
        .populateAll()
        .then(_manager => {
          if(!_manager) return reject(404);
          return resolve(_manager);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find (data) {
    return new Promise((resolve, reject) => {
      Manager.find({
        skip: data.start || 0,
        limit: data.end || 0,
        sort: 'id DESC'
      })
        .populateAll()
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  destroy (data) {
    return new Promise((resolve, reject) => {
      Manager.destroy({ id: data })
        .meta({ fetch: true })
        .then(resolve)
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

          Manager.findOne({ user: _user.email })
            .populateAll()
            .then(_manager => {
              if(!_manager) return reject(404);

              return resolve(_manager);
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
