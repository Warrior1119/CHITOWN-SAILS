'use strict';

module.exports = {
  attributes: {
    clientId: {
      columnName: 'client_id',
      model: 'client',
      required: true
    },

    weight: {
      type: 'number',
      required: true
    },

    height: {
      type: 'number',
      required: true
    },

    bfp: {
      type: 'number',
      required: true
    },

    waist: {
      type: 'number',
      required: true
    },

    hips: {
      type: 'number',
      required: true
    },

    cb: {
      type: 'number',
      required: true
    },

    thighs: {
      type: 'number',
      required: true
    },

    arms: {
      type: 'number',
      required: true
    }
  }
};
