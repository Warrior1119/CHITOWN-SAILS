'use strict';

module.exports = {
  clientAnalytics: {
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

    reportType: {
      type: 'string',
      required: true,
      permission: 1
    },

    clientId: {
      type: 'number',
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
