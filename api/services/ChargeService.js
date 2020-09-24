'use strict';
const stripe = require('stripe')(sails.config.custom.stripe.apiKey);
stripe.setApiVersion(sails.config.custom.stripe.apiVer);

function charge (data) {
  return new Promise(function (resolve, reject) {
    stripe.charges.create(data, (err, charge) => {
      if(err) return reject({ errCode: 'stripe', message: err });

      return resolve(charge);
    });
  });
}

module.exports = {
  chargeForTraining (data) {
    return new Promise((resolve, reject) => {
      Product.findOne({ clientId: data.client.id, name: data.productName, duration: data.duration })
        .then(_product => {
          if(!_product) return reject(402);

          if(_product.quantity === 5) EmailService.fourLeft(data.client, data.productName);
          else if(_product.quantity === 2) EmailService.oneLeft(data.client, data.productName);
          else if(_product.quantity === 1) EmailService.zeroLeft(data.client, data.productName);
          else if(_product.quantity === -3) return reject(402); // client can have max 3 outstanding payments for trainigs

          if(_product.quantity === 0) { // allow trainigs credit only when client have credit card
            if(data.client.creditCardId) {
              Product.update({ id: _product.id }).set({ quantity: _product.quantity - 1 })
                .then(() => {

                  return Training.find({
                    where: {
                      mainClient: data.client.id,
                      type: data.productName,
                      date: { '>': new Date(data.date).getTime() }
                    },
                    sort: 'id ASC'
                  }).limit(1);
                })
                .then(_training => {
                  if(_training) {
                    EmailService.minusOneLeft(data.client, data.productName, data.trainer, data.date)
                      .then(resolve)
                      .catch(reject);
                  } else {
                    return resolve();
                  }
                })
                .catch(err => {
                  sails.log.error(err);
                  return reject();
                });
            } else {
              return reject(402);
            }
          } else {
            Product.update({ id: _product.id }).set({ quantity: _product.quantity - 1 })
              .then(resolve)
              .catch(err => {
                sails.log.error(err);
                return reject();
              });
          }
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  charge (data, client, cardToken) {
    return new Promise((resolve, reject) => {
      if(data.amount === 0) return resolve();
      else {
        const chargeData = {
          amount: data.amount * 100,
          currency: 'USD',
          description: data.description,
          customer: client.customerId
        };

        if(client.creditCardId)
          ClientService.deleteCreditCard(client.id)
            .then(() => ClientService.saveCreditCard({ clientId: client.id , token: cardToken }))
            .then(() => charge(chargeData))
            .then(resolve)
            .catch(reject);
        else
          ClientService.saveCreditCard({ clientId: client.id , token: cardToken })
            .then(() => charge(chargeData))
            .then(resolve)
            .catch(reject);
      }
    });
  },

  refund (chargeId) {
    return new Promise((resolve, reject) => {
      stripe.refunds.create({ charge: chargeId }, (err, refund) =>  {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }

        return resolve(refund);
      });
    });
  }
};
