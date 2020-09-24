'use strict';

module.exports = {
  attributes: {
    productId: {
      columnName: 'product_id',
      model: 'shopitem'
    },

    name: {
      type: 'string',
      required: true
    },

    quantity: {
      type: 'number',
      required: true
    },

    spent: {
      type: 'number',
      required: true
    },

    paid: {
      type: 'number',
      required: true
    },

    discount: {
      type: 'number',
      defaultsTo: 0
    },

    buildingId: {
      columnName: 'building_id',
      model: 'building',
      required: false
    },

    trainerId: {
      columnName: 'trainer_id',
      model: 'trainer',
      required: false
    },

    clientId: {
      columnName: 'client_id',
      model: 'client',
      required: true
    },

    trainingId: {
      columnName: 'training_id',
      model: 'training',
      required: false
    },

    chargeId: {
      columnName: 'charge_id',
      type: 'string',
      allowNull: true
    },

    customEvent: {
      columnName: 'custom_event',
      type: 'boolean',
      defaultsTo: false
    }
  }
};
