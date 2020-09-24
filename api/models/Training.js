'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    description: {
      type: 'string',
      required: false
    },

    date: {
      type: 'number',
      required: true
    },

    trainerId: {
      columnName: 'trainer_id',
      model: 'trainer',
      required: false
    },

    clients: {
      collection: 'client'
    },

    mainClient: {
      columnName: 'main_client',
      model: 'client',
      required: false
    },

    duration: {
      type: 'number',
      required: true
    },

    type: {
      model: 'trainingtype',
      required: true
    },

    cost: {
      type: 'number',
      defaultsTo: 0
    },

    capacity: {
      type: 'number',
      defaultsTo: 1
    },

    buildingId: {
      columnName: 'building_id',
      model: 'building',
      required: false
    },

    canceled: {
      type: 'boolean',
      defaultsTo: false
    },

    gid: {
      type: 'number',
      allowNull: true
    },

    event: {
      type: 'boolean',
      defaultsTo: false
    },

    file: {
      type: 'string',
      allowNull: true
    },

    image: {
      type: 'string',
      required: false,
    },

    place: {
      type: 'string',
      required: false,
    }
  }
};
