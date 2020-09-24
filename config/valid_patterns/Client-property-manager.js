'use strict';
module.exports = {
  clientPropertyManager: {
    user: {
      type: 'email',
      required: false,
      permission: -1
    },

    email: {
      type: 'email',
      required: true,
      permission: 3
    },

    firstName: {
      type: 'string',
      required: true,
      permission: 3
    },

    lastName: {
      type: 'string',
      required: true,
      permission: 3
    },

    password: {
      type: 'string',
      required: false,
      permission: -1
    },

    role: {
      type: 'string',
      required: false,
      permission: -1
    },

    customerId: {
      type: 'string',
      required: false,
      permission: -1
    },

    trainerId: {
      type: 'number',
      required: false,
      permission: -1
    },

    buildingId: {
      type: 'number',
      required: false,
      permission: -1
    },

    tag: {
      type: 'string',
      required: false,
      permission: -1
    },

    isActive: {
      type: 'boolean',
      required: false,
      permission: -1
    },

    gender: {
      type: 'string',
      required: true,
      permission: 3
    },

    street: {
      type: 'string',
      required: true,
      permission: 3
    },

    apartment: {
      type: 'string',
      required: true,
      permission: 3
    },

    zipCode: {
      type: 'string',
      required: true,
      permission: 3
    },

    phone: {
      type: 'number',
      required: true,
      permission: 3
    },

    birth: {
      type: 'number',
      required: true,
      permission: 3
    },

    newsletter: {
      type: 'boolean',
      required: false,
      permission: 3
    },

    notification: {
      type: 'boolean',
      required: false,
      permission: 3
    },

    active: {
      type: 'boolean',
      required: false,
      permission: -1
    },

    code:  {
      type: 'number',
      required: false,
      permission: -1
    },

    fromFacebook: {
      type: 'boolean',
      required: false,
      permission: -1
    }
  }
};
