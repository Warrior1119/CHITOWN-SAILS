'use strict';
const stripe = require('stripe')(sails.config.custom.stripe.apiKey);
stripe.setApiVersion(sails.config.custom.stripe.apiVer);

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      stripe.skus.create({
        product: data.productID,
        price: data.price,
        currency: 'usd',
        inventory: { type: 'infinite' },
        attributes: { amount: data.amount }
      }, (err, sku) => {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }

        return resolve(sku);
      });
    });
  },

  find (lastSkuID) {
    return new Promise((resolve, reject) => {
      stripe.skus.list({
        // eslint-disable-next-line
        starting_after: lastSkuID,
        limit: 20
      },
      (err, skus) => {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }

        return resolve(skus);
      });
    });
  },

  findOne (skuID) {
    return new Promise((resolve, reject) => {

      stripe.skus.retrieve(skuID, (err, sku) => {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }

        return resolve(sku);
      });
    });
  },

  update (skuID, data) {
    return new Promise((resolve, reject) => {

      stripe.skus.update(skuID, data, (err, sku) => {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }

        return resolve(sku);
      });
    });
  },

  destroy (skuID) {
    return new Promise((resolve, reject) => {

      stripe.skus.del(skuID, (err, sku) => {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }

        return resolve(sku);
      });
    });
  }
};
