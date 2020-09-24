'use strict';
const redis = require("redis");
const bcrypt = require('bcryptjs');
const client = redis.createClient({ host: sails.config.custom.redis.host });
client.on("error", function (err) {
  sails.log.error(err);
});

module.exports = {
  remind (email) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: email })
        .then(_user => {
          if(!_user) return reject(404);
          if(_user.role === 'Client') {
            Client.findOne({ user: _user.email, fromFacebook: true })
              .then(_client => {
                if(_client) return reject(403);

                EmailService.sendResetPassword(email)
                  .then(resolve)
                  .catch(reject);
              })
              .catch(err => {
                sails.log.error(err);
                return reject();
              });
          } else {
            EmailService.sendResetPassword(email)
              .then(resolve)
              .catch(reject);
          }
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  validateHash (data) {
    return new Promise((resolve, reject) => {
      client.get('pass_' + data.email, (err, hash) => {
        if(err) {
          sails.log.error(err);
          return reject();
        }

        if(!hash) return reject(404);
        if(hash !== data.hash) return reject(400);

        return resolve();
      });
    });
  },

  reset (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: data.email })
        .then(_user => {
          if(!_user) return reject(404);

          bcrypt.hash(data.password, 15, function (err, hash) {
            if(err) {
              sails.log.error(err);
              return reject();
            }

            User.update({ email: data.email })
              .set({ password: hash })
              .then(resolve)
              .catch(err => {
                sails.log.error(err);
                return reject();
              });
          });

        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
