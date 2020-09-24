'use strict';

module.exports = {
  productstripe: {
    name: {
      type: 'string',
      required: true,
      permission: 1
    },

    description: {
      type: 'string',
      required: true,
      permission: 1
    },

    icon: {
      type: 'string',
      required: true,
      permission: 1
    },

    color: {
      type: 'string',
      required: true,
      permission: 1
    }
  }
};
