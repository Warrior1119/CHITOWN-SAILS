'use strict';
module.exports = {
  training: {
    name: {
      type: 'string',
      required: true,
      permission: 2
    },

    description: {
      type: 'string',
      required: false,
      permission: 2
    },

    date: {
      type: 'number',
      required: true,
      permission: 2
    },

    trainerId: {
      type: 'number',
      required: false,
      permission: 2
    },

    clients: {
      type: 'array',
      subType: 'number',
      required: false,
      permission: 4
    },

    mainClient: {
      type: 'number',
      required: false,
      permission: 2
    },

    duration: {
      type: 'number',
      required: true,
      permission: 2
    },

    type: {
      type: 'string',
      required: true,
      permission: 2
    },

    cost: {
      type: 'number',
      required: true,
      permission: 2
    },

    capacity: {
      type: 'number',
      required: true,
      permission: 2
    },

    buildingId: {
      type: 'number',
      required: false,
      permission: 1
    },

    event: {
      type: 'boolean',
      required: false,
      permission: 1
    },

    file: {
      type: 'string',
      required: false,
      permission: 2
    },

    place: {
      type: 'string',
      required: false,
      permission: 2
    }
  }
};
