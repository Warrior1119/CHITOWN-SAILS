'use strict';

module.exports = {
  sku: {
    name: {
      type: 'string',
      required: true,
      permission: 1
    },

    productId: {
      type: 'number',
      required: true,
      permission: 1
    },

    duration: {
      type: 'number',
      required: false,
      permission: 1
    },

    quantity: {
      type: 'number',
      required: false,
      permission: 1
    },

    cost: {
      type: 'number',
      required: true,
      permission: 1
    },

    active: {
      type: 'boolean',
      required: false,
      permission: 1
    }
  }
};
