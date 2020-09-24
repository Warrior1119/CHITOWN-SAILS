'use strict';

module.exports = {
  neighbourhood: {
    name: {
      type: 'string',
      required: true,
      permission: 3
    },

    buildingId: {
      type: 'number',
      required: false,
      permission: 2
    },

    tag: {
      type: 'string',
      required: true,
      permission: 3
    },

    description: {
      type: 'string',
      required: false,
      permission: 3
    },

    link: {
      type: 'string',
      required: true,
      permission: 3
    }
  }
};
