'use strict';
module.exports = {
  manager: {
    email: {
      type: 'email',
      required: true,
      permission: 0
    },

    firstName: {
      type: 'string',
      required: true,
      permission: 1
    },

    lastName: {
      type: 'string',
      required: true,
      permission: 1
    },

    password: {
      type: 'string',
      required: false,
      permission: 1
    },

    role: {
      type: 'string',
      required: true,
      permission: 0
    }
  }
};
