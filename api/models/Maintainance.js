'use strict';

module.exports = {
  attributes: {
    type: {
      type: 'string',
      isIn: [ 'Default' ],
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

    description: {
      type: 'string',
      required: true
    },

    done: {
      type: 'boolean',
      defaultsTo: false
    },
  }
};
