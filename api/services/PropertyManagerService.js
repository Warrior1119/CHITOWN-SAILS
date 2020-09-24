'use strict';
function validBuilding (id, email) {
  return new Promise((resolve, reject) => {
    if(!id) return resolve();
    Building.findOne({ id: id })
      .then(_building => {
        if(!_building) throw { errCode: 400, message: 'Building not exist' };

        return PropertyManager.findOne({ buildingId: id });
      })
      .then(_propertyManager => {
        if(_propertyManager && _propertyManager.user !== email) throw { errCode: 409, message: 'Building already have property manager' };

        return resolve();
      })
      .catch(reject);
  });
}
module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      validBuilding(data.buildingId)
        .then(() => PropertyManager.create({ user: data.user, gender: data.gender, buildingId: data.buildingId }).meta({ fetch: true }))
        .then(_propertyManager => Promise.all([
          _propertyManager,
          EmailService.sendActivationStaff(_propertyManager.user)
        ]))
        .then(([ _propertyManager ]) => resolve(_propertyManager))
        .catch(err => {
          sails.log.error(err);
          return reject(err);
        });
    });
  },

  update (data = {}) {
    return new Promise((resolve, reject) => {
      PropertyManager.findOne({ id: data.id })
        .then(_propertyManager => {
          if(!_propertyManager) throw { errCode: 404, message: 'Property manager not found' };

          return validBuilding(data.buildingId, _propertyManager.user);
        })
        .then(() => PropertyManager.update({ id: data.id }).set(data).meta({ fetch: true }))
        .then(_propertyManager => resolve(_propertyManager[0]))
        .catch(reject);
    });
  },

  updateByPropertyManager (data = {}) {
    return new Promise((resolve, reject) => {

      delete data.buildingId;

      User.findOne({ id: data.id })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };
          delete data.id;

          return PropertyManager.update({ user: _user.email }).set(data).meta({ fetch: true });
        })
        .then(_propertyManager => resolve(_propertyManager[0]))
        .catch(reject);
    });
  },

  findOne (id) {
    return new Promise((resolve, reject) => {
      PropertyManager.findOne({ id: id })
        .populateAll()
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find () {
    return new Promise((resolve, reject) => {
      PropertyManager.find()
        .populateAll()
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  getDashboard (id) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: id })
        .then(_user => {
          if(!_user) return reject(404);

          return PropertyManager.findOne({ user: _user.email }).populateAll();
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
