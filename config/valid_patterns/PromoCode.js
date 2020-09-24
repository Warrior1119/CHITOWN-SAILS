'use strict';

module.exports = {
  promoCode: {
    hash: {
      type: 'string',
      required: false,
      permission: 1
    },

    quantity: {
      type: 'number',
      required: true,
      permission: 1
    },

    discountAmount: {
      type: 'number',
      required: true,
      permission: 1
    },

    discountType: {
      type: 'string',
      required: true,
      permission: 1
    },

    active: {
      type: 'boolean',
      required: true,
      permission: 1
    },

    all: {
      type: 'boolean',
      required: false,
      permission: 1
    },

    expDate: {
      type: 'number',
      required: false,
      permission: 1
    }
  }
};
