'use strict';

module.exports = {
  attributes: {
    clientId: {
      columnName: 'client_id',
      model: 'client',
      required: true
    },

    date: {
      type: 'number',
      required: true
    },

    trainingId: {
      columnName: 'training_id',
      model: 'training',
      required: true
    },

    participation: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
