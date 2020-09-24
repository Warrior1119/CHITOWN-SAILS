'use strict';
module.exports = {
  create(data, req) {
    return new Promise((resolve, reject) => {
      const images = [
        { file: req.file('logo'), dir: './opt/neighbourhood_images/' },
        { file: req.file('image'), dir: './opt/neighbourhood_images/' }
      ];
      UploadService.uploadMany(images)
        .then(_files => {
          if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
          if(_files[1]) data[_files[1].field] = _files[1].fd.replace(/^.*[\\\/]/, '');

          Neighbourhood.create(data)
          .meta({ fetch: true })
          .then(resolve)
          .catch(err => {
            sails.log.error(err);
            return reject();
          });

        })
        .catch(reject)
      })
  },

  destroy(data) {
    return new Promise((resolve, reject) => {
      Neighbourhood.destroy({ id: data })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find() {
    return new Promise((resolve, reject) => {
      Neighbourhood.find({})
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  update(data, req) {
    return new Promise((resolve, reject) => {
      Neighbourhood.findOne({id: data.id})
      .then(_neighbourhood => {

        if(!_neighbourhood) return reject(404);
        const images = [
          { file: req.file('logo'), dir: './opt/neighbourhood_images/' },
          { file: req.file('image'), dir: './opt/neighbourhood_images/' }
        ];
        UploadService.uploadMany(images)
          .then(_files => {
            if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
            if(_files[1]) data[_files[1].field] = _files[1].fd.replace(/^.*[\\\/]/, '');

            Neighbourhood.update({ id: data.id })
            .set(data)
            .meta({ fetch: true })
            .then(_prospectNeighbourhood => {
              return Neighbourhood.findOne({ id: _prospectNeighbourhood[0].id }).populateAll();
            })
            .then(resolve)
            .catch(err => {
              sails.log.error(err);
              return reject();
            });

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

  findOne(id) {
    return new Promise((resolve, reject) => {
      Neighbourhood.findOne({ id: id })
        .then(neighbourhood => {
          if(!neighbourhood) {
            return reject(404);
          };

          return resolve(neighbourhood);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },
};
