'use strict';

module.exports = {
  sales: {
    start: {
      type: 'number',
      required: true,
      permission: 1
    },

    end: {
      type: 'number',
      required: true,
      permission: 1
    },

    type: {
      type: 'string',
      required: true,
      permission: 1
    },

    trainerId: {
      type: 'number',
      required: true,
      permission: 1
    },

    buildingId: {
      type: 'number',
      required: true,
      permission: 1
    }
  }
};
