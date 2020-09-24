'use strict';

module.exports = {
  booking: {
    typeId: {
      type: 'number',
      required: true,
      permission: 4
    },

    date: {
      type: 'number',
      required: true,
      permission: 4
    },

    message: {
      type: 'string',
      required: false,
      permission: 4
    }
  }
};
