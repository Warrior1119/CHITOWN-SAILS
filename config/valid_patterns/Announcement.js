'use strict';

module.exports = {
  announcement: {
    title: {
      type: 'string',
      required: true,
      permission: 3
    },

    buildingId: {
      type: 'number',
      required: false,
      permission: -1
    },

    issuedBy: {
      type: 'email',
      required: false,
      permission: -1
    },

    file: {
      type: 'string',
      required: true,
      permission: 3
    },

    active: {
      type: 'boolean',
      required: false,
      permission: -1
    }
  }
};
