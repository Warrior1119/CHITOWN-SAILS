'use strict';

module.exports = {
  attributes: {
    title: {
      type: 'string',
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

    file: {
      type: 'string',
      required: true
    },

    active: {
      type: 'boolean',
      defaultsTo: false
    },
  }
};
