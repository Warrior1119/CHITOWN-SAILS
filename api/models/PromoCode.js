'use strict';

module.exports = {
  attributes: {
    hash: {
      type: 'string',
      required: true
    },

    quantity: {
      type: 'number',
      required: true
    },

    discountAmount: {
      columnName: 'discount_amount',
      type: 'number',
      required: true
    },

    discountType: {
      columnName: 'discount_type',
      type: 'string',
      isIn: [ 'percentage', 'value' ],
      required: true
    },

    active: {
      type: 'boolean',
      required: true
    },

    all: {
      type: 'boolean',
      defaultsTo: false
    },

    products: {
      collection: 'shopitem'
    },

    expDate: {
      columnName: 'exp_date',
      type: 'number',
      defaultsTo: new Date().getTime() + sails.config.custom.timestamps.month
    }
  }
};
