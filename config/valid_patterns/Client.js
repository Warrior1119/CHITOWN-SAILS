'use strict';
module.exports = {
  client: {
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
      permission: 4
    },

    lastName: {
      type: 'string',
      required: true,
      permission: 4
    },

    password: {
      type: 'string',
      required: true,
      permission: 0
    },

    role: {
      type: 'string',
      required: true,
      permission: 0
    },

    customerId: {
      type: 'string',
      required: false,
      permission: 0
    },

    trainerId: {
      type: 'number',
      required: false,
      permission: 1
    },

    buildingId: {
      type: 'number',
      required: false,
      permission: 1
    },

    tag: {
      type: 'string',
      required: true,
      permission: 1
    },

    isActive: {
      type: 'boolean',
      required: false,
      permission: 1
    },

    gender: {
      type: 'string',
      required: false,
      permission: 4
    },

    street: {
      type: 'string',
      required: true,
      permission: 4
    },

    apartment: {
      type: 'string',
      required: true,
      permission: 4
    },

    zipCode: {
      type: 'string',
      required: true,
      permission: 4
    },

    phone: {
      type: 'number',
      required: true,
      permission: 4
    },

    birth: {
      type: 'number',
      required: false,
      permission: 4
    },

    newsletter: {
      type: 'boolean',
      required: false,
      permission: 4
    },

    notification: {
      type: 'boolean',
      required: false,
      permission: 4
    },

    active: {
      type: 'boolean',
      required: false,
      permission: 3
    },

    code:  {
      type: 'number',
      required: false,
      permission: 4
    },

    fromFacebook: {
      type: 'boolean',
      required: false,
      permission: 0
    }
  }
};
