'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    buildings: {
      collection: 'building'
    }
  }
};
