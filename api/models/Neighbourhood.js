'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    buildingId: {
      columnName: 'building_id',
      model: 'building',
      required: false
    },

    tag: {
      type: 'string',
      required: true
    },

    image: {
      type: 'string',
      defaultsTo: 'neighbourhood_image.png'
    },

    logo: {
      type: 'string',
      defaultsTo: 'neighbourhood_logo.png'
    },

    category: {
      type: 'string',
      required: true
    },

    description: {
      type: 'string',
      required: false
    },

    link: {
      type: 'string',
      required: true
    }
  }
};
