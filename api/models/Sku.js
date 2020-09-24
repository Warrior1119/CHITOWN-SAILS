'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    productId: {
      columnName: 'product_id',
      model: 'shopitem',
      required: true
    },

    duration: {
      type: 'number',
      required: false
    },

    quantity: {
      type: 'number',
      defaultsTo: 1
    },

    cost: {
      type: 'number',
      required: true
    },

    active: {
      type: 'boolean',
      defaultsTo: true
    }
  }
};
