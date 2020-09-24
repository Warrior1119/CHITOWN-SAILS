'use strict';
module.exports = {
  upload (data) {
    return new Promise((resolve, reject) => {
      // TODO: Add validation file format type
      if(data.file === undefined) return resolve(); // reurn empty response
      data.file.upload({ maxBytes: 10000000, dirname: require('path').resolve(sails.config.appPath, data.dir) },
        function whenDone (err, uploadedFiles) {
          if(err) {
            sails.log.error(err);
            return reject();
          }

          if(uploadedFiles[0] === undefined) return resolve();
          return resolve(uploadedFiles[0].fd);
        });
    });
  },

  uploadMany (files) {
    return new Promise((resolve, reject) => {
      const filesContainer = [];
      async.each(files, (data, next) => {

        if(data.file === undefined) return next();

        data.file.upload({ maxBytes: 10000000, dirname: require('path').resolve(sails.config.appPath, data.dir) }, (err, uploadedFiles) => {
          if(err) return next(err);

          if(uploadedFiles[0] === undefined) return next();

          filesContainer.push(uploadedFiles[0]);
          return next();
        });
      }, err => {
        if(err) {
          sails.log.error(err);
          return reject();
        }

        return resolve(filesContainer);
      });
    });
  },

  uploadImage (files) {
    return new Promise((resolve, reject) => {
      const filesContainer = [];
      async.each(files, (data, next) => {

        if(data.file === undefined) return next();

        data.file.upload({ maxBytes: 2000000, dirname: require('path').resolve(sails.config.appPath, data.dir) }, (err, uploadedFiles) => {
          if(err) return next(err);

          if(uploadedFiles[0] === undefined) return next();

          filesContainer.push(uploadedFiles[0]);
          return next();
        });
      }, err => {
        if(err) {
          sails.log.error(err);
          return reject();
        }

        return resolve(filesContainer);
      });
    });
  },
};
