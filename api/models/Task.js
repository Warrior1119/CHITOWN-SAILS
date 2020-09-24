'use strict';

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    description: {
      type: 'string',
      required: true
    },

    category: {
      type: 'string',
      required: false
    },

    priority: {
      type: 'number',
      defaultsTo: 1
    },

    date: {
      type: 'number',
      required: false
    },

    managerId: {
      columnName: 'manager_id',
      model: 'manager',
      required: false
    },

    user: {
      columnName: 'user_email',
      model: 'user',
      required: false
    },

    done: {
      type: 'boolean',
      defaultsTo: false
    },

    template: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
