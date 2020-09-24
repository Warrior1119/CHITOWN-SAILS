'use strict';

module.exports = {
  buy: {
    skuId: {
      type: 'number',
      required: true,
      permission: 4
    },

    cardToken: {
      type: 'string',
      required: true,
      permission: 4
    },

    recipient: {
      type: 'email',
      required: false,
      permission: 4
    },

    message: {
      type: 'string',
      required: false,
      permission: 4
    },

    giftCard: {
      type: 'string',
      required: false,
      permission: 4
    },

    promoCode: {
      type: 'string',
      required: false,
      permission: 4
    }
  }
};
