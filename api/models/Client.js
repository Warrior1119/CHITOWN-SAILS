'use strict';

module.exports = {
  attributes: {
    user: {
      columnName: 'user_email',
      model: 'user',
      required: true
    },

    customerId: {
      columnName: 'customer_id',
      type: 'string',
    },

    creditCardId: {
      columnName: 'credit_card_id',
      type: 'string',
    },

    trainerId: {
      columnName: 'trainer_id',
      model: 'trainer',
      required: false
    },

    buildingId: {
      columnName: 'building_id',
      model: 'building',
      required: false
    },

    gender: {
      type: 'string',
      required: true
    },

    street: {
      type: 'string',
      required: true
    },

    apartment: {
      type: 'string',
      required: true
    },

    zipCode: {
      columnName: 'zip_code',
      type: 'string',
      required: true
    },

    phone: {
      type: 'number',
      required: true
    },

    birth: {
      type: 'number',
      required: true
    },

    newsletter: {
      type: 'boolean',
      defaultsTo: false
    },

    notification: {
      type: 'boolean',
      defaultsTo: false
    },

    active: {
      type: 'boolean',
      defaultsTo: true
    },

    fromFacebook: {
      columnName: 'from_facebook',
      type: 'boolean',
      defaultsTo: false
    },

    tag: {
      type: 'string',
      isIn: [ 'Paying', 'Freemium', 'Prospect' ],
      required: true
    },

    deleted: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  customToJSON: function () {
    return _.forEach(this, (value, key) => {
      if(key === 'creditCardId') this[key] = true;
    });
  },
};
