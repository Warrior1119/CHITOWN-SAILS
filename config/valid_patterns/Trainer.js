'use strict';
module.exports = {
  trainer: {
    user: {
      type: 'email',
      required: false,
      permission: -1
    },

    email: {
      type: 'email',
      required: true,
      permission: -1
    },

    firstName: {
      type: 'string',
      required: true,
      permission: 2
    },

    lastName: {
      type: 'string',
      required: true,
      permission: 2
    },

    role: {
      type: 'string',
      required: true,
      permission: 1
    },

    gender: {
      type: 'string',
      required: true,
      permission: 2
    },

    street: {
      type: 'string',
      required: false,
      permission: 2
    },

    apartment: {
      type: 'string',
      required: false,
      permission: 2
    },

    zipCode: {
      type: 'string',
      required: false,
      permission: 2
    },

    phone: {
      type: 'number',
      required: true,
      permission: 2
    },

    services: {
      type: 'array',
      subType: 'string',
      required: false,
      permission: 1
    }
  }
};
