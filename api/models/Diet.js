'use strict';
const crypto = require('crypto');

module.exports = {
  attributes: {
    clientId: {
      columnName: 'client_id',
      model: 'client',
      required: true
    },

    fileName: {
      columnName: 'file_name',
      type: 'string'
    },

    path: {
      type: 'string'
    },

    name: {
      type: 'string',
      required: true
    },

    hash: {
      type: 'string',
      defaultsTo: crypto.randomBytes(16).toString('hex')
    }
  }
};
