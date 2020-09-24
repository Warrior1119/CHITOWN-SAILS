'use strict';

module.exports = {
  maintainance: {
    type: {
      type: 'string',
      required: true,
      permission: 4
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

    description: {
      type: 'string',
      required: true,
      permission: 4
    },

    done: {
      type: 'boolean',
      required: false,
      permission: -1
    }
  }
};
