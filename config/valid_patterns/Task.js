'use strict';

module.exports = {
  task: {
    name: {
      type: 'string',
      required: true,
      permission: 1
    },

    description: {
      type: 'string',
      required: true,
      permission: 1
    },

    category: {
      type: 'string',
      required: true,
      permission: 1
    },

    priority: {
      type: 'number',
      required: true,
      permission: 1
    },

    date: {
      type: 'number',
      required: false
    },

    user: {
      type: 'email',
      required: true,
      permission: 1
    },

    done: {
      type: 'boolean',
      required: false,
      permission: 2
    },

    template: {
      type: 'boolean',
      required: false,
      permission: -1
    }
  }
};
