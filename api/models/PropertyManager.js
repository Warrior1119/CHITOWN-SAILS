'use strict';

module.exports = {
  attributes: {
    user: {
      columnName: 'user_email',
      model: 'user',
      required: true
    },

    gender: {
      type: 'string',
      required: true
    },

    buildingId: {
      columnName: 'building_id',
      model: 'building',
      required: true
    }
  }
};
