'use strict';

module.exports = {
  attributes: {
    user: {
      columnName: 'user_email',
      model: 'user',
      required: true
    },

    gender: {
      type: 'string',
      required: true
    },

    street: {
      type: 'string',
      required: false
    },

    apartment: {
      type: 'string',
      required: false
    },

    zipCode: {
      columnName: 'zip_code',
      type: 'string',
      required: false
    },

    phone: {
      type: 'number',
      required: true
    },

    active: {
      type: 'boolean',
      defaultsTo: true
    }
  }
};
