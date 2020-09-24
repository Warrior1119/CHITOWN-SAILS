'use strict';
module.exports = {
  create (data, req) {
    return new Promise((resolve, reject) => {
      Building.findOne({ code: data.code })
        .then(_building => {
          if(_building) return reject(409);

          const images = [
            { file: req.file('logo'), dir: './opt/building_images/' },
            { file: req.file('image'), dir: './opt/building_images/' }
          ];

          UploadService.uploadMany(images)
            .then(_files => {
              if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
              if(_files[1]) data[_files[1].field] = _files[1].fd.replace(/^.*[\\\/]/, '');

              Building.create(data)
                .meta({ fetch: true })
                .then(resolve)
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

  destroy (data) {
    return new Promise((resolve, reject) => {
      Building.destroy({ id: data })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find () {
    return new Promise((resolve, reject) => {
      Building.find({})
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  update (data, req) {
    return new Promise((resolve, reject) => {
      /**
       Check if building with this code exist
      */
      Building.findOne({ id: { '!': data.id }, code: data.code })
        .then(_building => {
          if(_building) return reject(409);

          const images = [
            { file: req.file('logo'), dir: './opt/building_images/' },
            { file: req.file('image'), dir: './opt/building_images/' }
          ];
          UploadService.uploadMany(images)
            .then(_files => {
              if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
              if(_files[1]) data[_files[1].field] = _files[1].fd.replace(/^.*[\\\/]/, '');

              Building.update({ id: data.id })
                .set(data)
                .meta({ fetch: true })
                .then(_building => resolve(_building[0]))
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

  updateByPropertyManager (data, req) {
    return new Promise((resolve, reject) => {

      User.findOne({ id: data.propertyManagerUserId })
        .then(_user => {
          if(!_user) return reject(404);

          return PropertyManager.findOne({ user: _user.email });
        })
        .then(_propManager => {
          if(!_propManager) return reject(404);

          data.id = _propManager.buildingId;

          return this.update(data, req);
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOne (id) {
    return new Promise((resolve, reject) => {
      Building.findOne({ id: id })
        .then(building => {
          if(!building) return reject(404);

          return resolve(building);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOneByPropertyManager (propertyManagerUserId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: propertyManagerUserId })
        .then(_user => {
          if(!_user) return reject(404);

          return PropertyManager.findOne({ user: _user.email });
        })
        .then(_propManager => {
          if(!_propManager) return reject(404);

          return this.findOne(_propManager.buildingId);
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOneByCode (code) {
    return new Promise((resolve, reject) => {
      if(!code) return resolve();

      Building.findOne({ code: code, active: true })
        .then(building => {
          if(!building) return reject ({ errCode: 404, message: 'Building Code does not exist' });

          return resolve(building);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
