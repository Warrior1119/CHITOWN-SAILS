'use strict';

module.exports = {
  attributes: {
    trainerId: {
      columnName: 'trainer_id',
      model: 'trainer',
      required: true
    },

    serviceId: {
      columnName: 'service_id',
      model: 'trainingtype',
      required: true
    },

    fee: {
      type: 'number',
      required: true
    },

    percentage: {
      type: 'number',
      required: false
    }
  }
};
