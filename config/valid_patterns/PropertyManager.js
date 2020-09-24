'use strict';
module.exports = {
  propertyManager: {
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
      permission: 3
    },

    lastName: {
      type: 'string',
      required: true,
      permission: 3
    },

    role: {
      type: 'string',
      required: true,
      permission: 1
    },

    gender: {
      type: 'string',
      required: true,
      permission: 3
    },

    buildingId: {
      type: 'number',
      required: true,
      permission: 1
    }
  }
};
