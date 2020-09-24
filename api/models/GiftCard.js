'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    skuId: {
      columnName: 'sku_id',
      model: 'sku',
      required: true
    },

    hash: {
      type: 'string',
      required: true
    },

    expDate: {
      columnName: 'exp_date',
      type: 'number',
      required: true
    },

    value: {
      type: 'number',
      required: true
    }
  }
};
