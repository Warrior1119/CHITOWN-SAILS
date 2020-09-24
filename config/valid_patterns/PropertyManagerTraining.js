'use strict';
module.exports = {
  propertyManagerTraining: {
    name: {
      type: 'string',
      required: true,
      permission: 3
    },

    description: {
      type: 'string',
      required: false,
      permission: 3
    },

    date: {
      type: 'number',
      required: true,
      permission: 3
    },

    trainerId: {
      type: 'number',
      required: false,
      permission: -1
    },

    clients: {
      type: 'array',
      subType: 'number',
      required: false,
      permission: -1
    },

    mainClient: {
      type: 'number',
      required: false,
      permission: -1
    },

    duration: {
      type: 'number',
      required: true,
      permission: 3
    },

    type: {
      type: 'string',
      required: false,
      permission: -1
    },

    cost: {
      type: 'number',
      required: true,
      permission: 3
    },

    capacity: {
      type: 'number',
      required: true,
      permission: 3
    },

    buildingId: {
      type: 'number',
      required: false,
      permission: -1
    },

    canceled: {
      type: 'boolean',
      required: false,
      permission: 3
    },

    gid: {
      type: 'number',
      required: false,
      permission: -1
    },

    event: {
      type: 'boolean',
      required: false,
      permission: -1
    },

    file: {
      type: 'string',
      required: false,
      permission: 3
    }
  }
};
