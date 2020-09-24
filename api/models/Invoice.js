'use strict';

module.exports = {
  attributes: {
    fileName: {
      columnName: 'file_name',
      type: 'string',
      required: true
    },

    path: {
      type: 'string',
      required: true
    },

    user: {
      model: 'user',
      required: true
    },

    packageName: {
      type: 'string',
      required: true,
    },

    totalPrice: {
      type: 'number',
      required: true
    }
  }
};
