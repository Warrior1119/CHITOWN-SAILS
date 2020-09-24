'use strict';

module.exports = {
  measurements: {
    clientId: {
      type: 'number',
      required: false,
      permission: 2
    },

    weight: {
      type: 'number',
      required: true,
      permission: 4
    },

    height: {
      type: 'number',
      required: true,
      permission: 4
    },

    bfp: {
      type: 'number',
      required: true,
      permission: 4
    },

    waist: {
      type: 'number',
      required: true,
      permission: 4
    },

    hips: {
      type: 'number',
      required: true,
      permission: 4
    },

    cb: {
      type: 'number',
      required: true,
      permission: 4
    },

    thighs: {
      type: 'number',
      required: true,
      permission: 4
    },

    arms: {
      type: 'number',
      required: true,
      permission: 4
    }
  }
};
