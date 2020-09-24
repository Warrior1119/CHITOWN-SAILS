'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    price: {
      type: 'number',
      required: true
    },

    images: {
      type: 'json',
      defaultsTo: 'book_image.png'
    },

    questions: {
      type: 'string',
      required: true
    }
  }
};
