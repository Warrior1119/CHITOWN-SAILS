'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },

    icon: {
      type: 'string',
      required: false
    },

    color: {
      type: 'string',
      required: false
    },

    description: {
      type: 'string',
      required: true
    },

    category: {
      type: 'string',
      required: true
    },

    personal: {
      type: 'boolean',
      defaultsTo: true
    },

    imageInCategory: {
      columnName: 'image_in_category',
      type: 'string',
      defaultsTo: 'product_image_in_category.png'
    },

    image: {
      type: 'string',
      defaultsTo: 'product_image.png'
    },

    active: {
      type: 'boolean',
      defaultsTo: true
    },

    activeType: {
      columnName: 'active_type',
      type: 'boolean',
      defaultsTo: true
    },
  }
};
