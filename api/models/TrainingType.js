'use strict';

module.exports = {
  primaryKey: 'name',

  attributes: {
    name: {
      type: 'string',
      required: true
    },

    duration: {
      type: 'number',
      required: true
    },

    icon: {
      type: 'string',
      defaultsTo: 'def_service_icon'
    },

    color: {
      type: 'string',
      defaultsTo: '#909'
    },

    personal: {
      type: 'boolean',
      defaultsTo: true
    },

    active: {
      type: 'boolean',
      required: true
    }
  }
};
