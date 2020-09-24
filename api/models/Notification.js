'use strict';

module.exports = {
  attributes: {
    type: {
      type: 'string',
      isIn: [ 'All', 'Building', 'User' ],
      required: true
    },

    title: {
      type: 'string',
      required: true
    },

    issuedTo: {
      columnName: 'issued_to',
      model: 'user',
      required: false
    },

    sentThrough: {
      columnName: 'sent_through',
      type: 'string',
      isIn: [ 'Email', 'Web', 'Email and Web' ],
      required: true
    },

    buildingId: {
      columnName: 'building_id',
      model: 'building',
      required: false
    },

    issuedBy: {
      columnName: 'issued_by',
      model: 'user',
      required: true
    },

    pickedUp: {
      columnName: 'picked_up',
      type: 'boolean',
      required: false
    },

    description: {
      type: 'string',
      required: true
    },

    file: {
      type: 'string',
      allowNull: true
    },

    read: {
      type: 'boolean',
      required: false
    },

    image: {
      type: 'string',
      defaultsTo: 'notification_image.png',
    }
  }
};
