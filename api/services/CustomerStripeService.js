'use strict';
const stripe = require('stripe')(sails.config.custom.stripe.apiKey);
stripe.setApiVersion(sails.config.custom.stripe.apiVer);

module.exports = {
  create (clientID, data) {
    return new Promise((resolve, reject) => {
      stripe.customers.create({
        description: `${data.firstName} ${data.lastName}`,
        email: data.email
      }, (err, customer) => {
        if(err) {
          sails.log.error(err);
          return reject({ errCode: 'stripe', data: err });
        }
        ClientService.update({ id: clientID, customerId: customer.id })
          .then(resolve)
          .catch(reject);
      });
    });
  },

  destroy (customerID) {
    return new Promise((resolve, reject) => {
      stripe.customers.del(customerID, err => {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }
        return resolve();
      });
    });
  },

  update (customerID, data) {
    return new Promise((resolve, reject) => {
      stripe.customers.update(customerID, {
        description: `${data.firstName} ${data.lastName}`
      }, (err, customer) => {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }

        return resolve(customer);
      });
    });
  },

  findOne (customerID) {
    return new Promise((resolve, reject) => {
      stripe.customers.retrieve(customerID, (err, customer) => {
        if(err) {
          sails.log.error(err);
          return reject({ code: 'stripe', data: err });
        }

        return resolve(customer);
      });
    });
  }
};
