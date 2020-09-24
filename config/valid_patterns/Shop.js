'use strict';

module.exports = {
  shop: {
    name: {
      type: 'string',
      required: true,
      permission: 1
    },

    icon: {
      type: 'string',
      required: false,
      permission: 1
    },

    color: {
      type: 'string',
      required: false,
      permission: 1
    },

    description: {
      type: 'string',
      required: true,
      permission: 1
    },

    category: {
      type: 'string',
      required: true,
      permission: 1
    },

    personal: {
      type: 'boolean',
      required: false,
      permission: 1
    },

    active: {
      type: 'boolean',
      required: false,
      permission: 1
    },

    activeType: {
      type: 'boolean',
      required: false,
      permission: 1
    }
  }
};
