'use strict';

module.exports = {
  notification: {
    type: {
      type: 'string',
      required: true,
      permission: 3
    },

    title: {
      type: 'string',
      required: true,
      permission: 3
    },

    sentThrough: {
      type: 'string',
      required: true,
      permission: 3
    },

    issuedTo: {
      type: 'email',
      required: false,
      permission: 3
    },

    buildingId: {
      type: 'number',
      required: false,
      permission: 2
    },

    issuedBy: {
      type: 'email',
      required: false,
      permission: -1
    },

    pickedUp: {
      type: 'boolean',
      required: false,
      permission: 3
    },

    description: {
      type: 'string',
      required: true,
      permission: 3
    },

    file: {
      type: 'string',
      required: false,
      permission: 3
    },

    read: {
      type: 'boolean',
      required: false,
      permission: 3
    }
  }
};
