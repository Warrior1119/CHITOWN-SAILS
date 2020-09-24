'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  primaryKey: 'email',

  attributes: {
    email: {
      type: 'string',
      required: true
    },

    firstName: {
      columnName: 'first_name',
      type: 'string',
      required: true
    },

    lastName: {
      columnName: 'last_name',
      type: 'string',
      required: true
    },

    password: {
      type: 'string',
      required: true
    },

    avatar: {
      type: 'string',
      defaultsTo: 'avatar.png'
    },

    isActive: {
      columnName: 'is_active',
      type: 'boolean',
      defaultsTo: true
    },

    role: {
      type: 'string',
      isIn: [ 'Client', 'PropertyManager', 'Trainer', 'Manager', 'Administrator' ],
      required: true
    }
  },

  customToJSON: function () {
    return _.omit(this, [ 'password' ]);
  },

  beforeCreate (values, next) {
    bcrypt.hash(values.password, 15, function (err, hash) {
      if(err) {
        sails.log.error(err);
        return next(err);
      }

      values.password = hash;
      next();
    });
  },

  comparePassword (password, user) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, match) => {
        if(err) {
          sails.log.error(err);
          return reject();
        }

        if(match) return resolve();

        return reject(401);
      });
    });
  },
};
