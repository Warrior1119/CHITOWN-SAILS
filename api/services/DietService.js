'use strict';
module.exports = {
  upload (data) {
    return new Promise((resolve, reject) => {
      Diet.findOne({ hash: data.hash })
        .then(_diet => {
          if(!_diet) return reject(404);

          UploadService.upload({ file: data.diet, dir: './opt/diets/' })
            .then(_filePath => {
              Diet.update({ id: _diet.id })
                .set({
                  path: _filePath,
                  fileName: _filePath.split(/.*[\/|\\]/)[1].split('.')[0]
                })
                .meta({ fetch: true })
                .then(_diets => resolve(_diets[0]))
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

  addDiet ({ clientId, skuId, diet }) {
    return new Promise((resolve, reject) => {
      let sku;
      Client.findOne({ id: clientId })
        .populateAll()
        .then(client => {
          if(!client) throw { errCode: 400, message: `Client with this id not exist` };

          return Sku.findOne({ id: skuId }).populateAll();
        })
        .then(_sku => {
          if(!_sku) throw { errCode: 400, message: 'Sku with this id not exist' };
          if(_sku.productId.category !== `Nutrition Services`) throw { errCode: 400, message: 'Sku is not a diet plan' };
          sku = _sku;
          return UploadService.upload({ file: diet, dir: './opt/diets/' });
        })
        .then(_filePath => {
          console.log(_filePath);
          return Diet.findOrCreate({
            name: sku.name
          },{
            clientId: clientId,
            name: sku.name,
            path: _filePath,
            fileName: _filePath.split(/.*[\/|\\]/)[1].split('.')[0]
          });
        })
        .then(resolve)
        .catch(reject);
    });
  },

  findOne (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);

          return Diet.findOne({ fileName: data.fileName });
        })
        .then(_diet => {
          if(!_diet) return reject(404);

          return resolve({ path: _diet.path, name: _diet.name });
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find (clientId) {
    return new Promise((resolve, reject) => {
      Diet.find({ clientId: clientId })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findForClient (userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject(404);

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);

          this.find(_client.id)
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
