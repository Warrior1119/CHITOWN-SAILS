'use strict';

module.exports = {
  tasktemplate: {
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

    managerId: {
      type: 'number',
      required: false,
      permission: -1
    },

    user: {
      type: 'email',
      required: false,
      permission: -1
    },

    done: {
      type: 'boolean',
      required: false,
      permission: -1
    },

    template: {
      type: 'boolean',
      required: true,
      permission: 1
    }
  }
};
