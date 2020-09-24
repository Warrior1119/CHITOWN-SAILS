'use strict';

module.exports = {
  book: {
    name: {
      type: 'string',
      required: true,
      permission: 4
    },

    price: {
      type: 'number',
      required: true,
      permission: 4
    }
  }
};
