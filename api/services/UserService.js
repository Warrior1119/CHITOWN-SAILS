'use strict';

const crypto = require("crypto");

function createExtendedUser (data) {
  return new Promise(function (resolve, reject) {
    switch (data.role) {
      case 'Client':
        ClientService.create({
          user: data.email,
          fromFacebook: data.fromFacebook,
          trainerId: data.trainerId,
          firstName: data.firstName,
          lastName: data.lastName,
          birth: data.birth,
          gender: data.gender,
          phone: data.phone,
          notification: data.notification,
          newsletter: data.newsletter,
          street: data.street,
          apartment: data.apartment,
          zipCode: data.zipCode,
          buildingId: data.buildingId,
          tag: data.tag,
          isActive: data.isActive
        })
          .then(resolve)
          .catch(reject);
        break;
      case 'PropertyManager':
        PropertyManagerService.create({ user: data.email, gender: data.gender, buildingId: data.buildingId })
          .then(resolve)
          .catch(reject);
        break;
      case 'Trainer':
        TrainerService.create({ user: data.email, gender: data.gender, phone: data.phone, services: data.services })
          .then(resolve)
          .catch(reject);
        break;
      case 'Manager':
        ManagerService.create({
          user: data.email,
        })
          .then(resolve)
          .catch(reject);
        break;
      default:
        return reject(400); //bad request
    }
  });
}

function updateExtendedUser (data, role, permission) {
  return new Promise(function (resolve, reject) {
    switch (role) {
      case 'Client':
        ClientService.update(data)
          .then(resolve)
          .catch(reject);
        break;
      case 'PropertyManager':
        if(permission === 3) {
          PropertyManagerService.updateByPropertyManager(data)
            .then(resolve)
            .catch(reject);
        } else {
          PropertyManagerService.update(data)
            .then(resolve)
            .catch(reject);
        }
        break;
      case 'Trainer':
        if(permission === 2) {
          TrainerService.updateByTrainer(data)
            .then(resolve)
            .catch(reject);
        } else {
          TrainerService.update(data)
            .then(resolve)
            .catch(reject);
        }
        break;
      case 'Manager':
        ManagerService.update(data)
          .then(resolve)
          .catch(reject);
        break;
      default:
        return reject(400);
    }
  });
}

function destroyExtendedUser (data, role) {
  return new Promise((resolve, reject) => {
    switch (role) {
      case 'Client':
        ClientService.destroy(data)
          .then(resolve)
          .catch(reject);
        break;
      case 'PropertyManager':
        PropertyManagerService.destroy(data)
          .then(resolve)
          .catch(reject);
        break;
      case 'Trainer':
        TrainerService.destroy(data)
          .then(resolve)
          .catch(reject);
        break;
      case 'Manager':
        ManagerService.destroy(data)
          .then(resolve)
          .catch(reject);
        break;
      default:
        return reject(400);
    }
  });
}

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: data.email })
        .then(_user => {
          if(_user) return reject(409); //conflict

          //set first password for not self registered users like Trainer/Manager/Admin
          if(data.role !== 'Client') data.password = crypto.randomBytes(30).toString('hex');
          if(data.role === 'Client' && data.isActive === true) data.password = crypto.randomBytes(30).toString('hex');

          const featuredUser = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            birth: data.birth,
            password: data.password,
            role: data.role,
            isActive: data.isActive,
          };
          Utilities.uploadUserAvatar(data.avatar)
            .then(_pathToAvatar => {
              if(_pathToAvatar) featuredUser.avatar = _pathToAvatar;

              User.create(featuredUser)
                .meta({ fetch: true })
                .then(_user => {
                  createExtendedUser(data)
                    .then(_extUser => {
                      _extUser.user = _user;
                      return resolve(_extUser);
                    })
                    .catch(err => {
                      User.destroy({ email: featuredUser.email }).catch(sails.log.error);
                      switch (_user.role) {
                        case 'Client':
                          Client.destroy({ user: _user.email }).catch(reject);
                          break;
                        case 'PropertyManager':
                          PropertyManager.destroy({ user: _user.email }).catch(reject);
                          break;
                        case 'Trainer':
                          Trainer.destroy({ user: _user.email }).catch(reject);
                          break;
                        case 'Manager':
                          Manager.destroy({ user: _user.email }).catch(reject);
                          break;
                      }
                      return reject(err);
                    });
                })
                .catch(err => {
                  sails.log.error(err);
                  return reject();
                });
            })
            .catch(reject);

        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  createClientByPropertyManager (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };

          return PropertyManager.findOne({ user: _user.email });
        })
        .then(_propertyManager => {
          if(!_propertyManager) throw { errCode: 404, message: 'You are not property manager' };

          data.buildingId = _propertyManager.buildingId;
          data.fromFacebook = false;
          data.role = 'Client';
          data.isActive = true;
          data.tag = 'Freemium';

          return this.create(data);
        })
        .then(resolve)
        .catch(reject);
    });
  },

  update (data, role, req) {
    return new Promise((resolve, reject) => {
      const _data = Object.assign({}, data);

      updateExtendedUser(_data, role, req.permission)
        .then(_extUser => {

          delete data.id; // remove id from updating data cuz waterline SUCKS a lot!!!

          User.update({ email: _extUser.user })
            .set(data)
            .meta({ fetch: true })
            .then(_user => {
              const result = _extUser;
              result.user = _user[0];

              Utilities.uploadUserAvatar(req.file('avatar'))
                .then(_pathToAvatar => {
                  if(_pathToAvatar) {

                    data.avatar = _pathToAvatar;

                    User.update({ id: _user[0].id })
                      .set(data)
                      .then(() => {
                        result.user.avatar = _pathToAvatar;
                        return resolve(result);
                      })
                      .catch(err => {
                        sails.log.error(err);
                        return reject();
                      });
                  } else {
                    return resolve(result);
                  }

                })
                .catch(reject);
            })
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
        .catch(reject);
    });
  },

  destroy (data, role) {
    return new Promise((resolve, reject) => {
      destroyExtendedUser(data, role)
        .then(_extUser => {
          User.destroy({ email: _extUser.user })
            .then(resolve)
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
        .catch(reject);
    });
  },

  find (data) {
    return new Promise((resolve, reject) => {
      const models = {
        Client: Client,
        Trainer: Trainer,
        Manager: Manager,
      };
      const criteria = {
        skip: data.start || 0,
        limit: data.end || 0,
        sort: 'id DESC',
        where: {
          role: 'Client'
        }
      };

      criteria.where.or = [
        { email: { contains: data.query } },
        { firstName: { contains: data.query } },
        { lastName: { contains: data.query } }
      ];

      User.find(criteria)
        .then(users => {
          const emails = users.map(u => u.email);

          return models[data.userType].find({ user: emails }).populateAll();
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },
};
