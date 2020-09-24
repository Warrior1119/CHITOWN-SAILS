'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    productId: {
      columnName: 'product_id',
      model: 'shopitem'
    },

    icon: {
      type: 'string',
      defaultsTo: 'def_service_icon'
    },

    color: {
      type: 'string',
      defaultsTo: '#909'
    },

    clientId: {
      columnName: 'client_id',
      model: 'client',
      required: true
    },

    quantity: {
      type: 'number',
      required: true
    },

    duration: {
      type: 'number',
      required: true
    },

    invoicePath: {
      columnName: 'invoice_path',
      type: 'string',
      required: false
    },

    price: {
      type: 'number',
      required: false
    },

    expDate: {
      columnName: 'exp_date',
      type: 'number',
      defaultsTo: new Date().getTime() + sails.config.custom.timestamps.year
    }
  }
};
