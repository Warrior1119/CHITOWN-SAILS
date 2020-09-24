'use strict';

const crypto = require('crypto');

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      if(!data.hash) data.hash = crypto.randomBytes(10).toString('hex');

      PromoCode.findOne({ hash: data.hash })
        .then(_product => {
          if(_product) return reject(409);

          return PromoCode.create(data).meta({ fetch: true });
        })
        .then(_product => {
          return PromoCode.findOne({ id: _product.id }).populateAll();
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find () {
    return new Promise((resolve, reject) => {
      PromoCode.find({ sort: 'id DESC' })
        .populateAll()
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOne (hash) {
    return new Promise((resolve, reject) => {
      PromoCode.findOne({ hash: hash })
        .populateAll()
        .then(_promo => {
          if(!_promo) return reject(404);

          return resolve(_promo);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  destroy (hash) {
    return new Promise((resolve, reject) => {
      PromoCode.destroy({ hash: hash })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
