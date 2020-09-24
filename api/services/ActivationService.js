'use strict';
const redis = require("redis");
const client = redis.createClient({ host: sails.config.custom.redis.host });

client.on("error", function (err) {
  sails.log.error(err);
});

module.exports = {
  activate (data) {
    return new Promise((resolve, reject) => {
      client.get('activate_' + data.email, (err, hash) => {
        if(err) {
          sails.log.error(err);
          return reject;
        }
        if(hash !== data.hash) return reject(401);

        User.update({ email: data.email })
          .set({ isActive: true })
          .then(() => {
            client.del('activate_' + data.email, err => {
              if(err) {
                sails.log.error(err);
                return reject();
              }

              return resolve();
            });
          })
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
      });
    });
  },

  resend (email) {
    return new Promise((resolve, reject) => {
      client.del('activate_' + email, err => {
        if(err) {
          sails.log.error(err);
          return reject;
        }

        User.findOne({ email: email })
          .then(_user => {
            if(!_user) return reject(404);

            if(_user.role === 'Trainer') {
              Trainer.findOne({ user: _user.email })
                .then(_trainer => {
                  if(!_trainer) return reject(403);

                  EmailService.sendActivationStaff(email)
                    .then(resolve)
                    .catch(reject);
                })
                .catch(err => {
                  sails.log.error(err);
                  return reject();
                });
            } else if(_user.role === 'Client') {
              Client.findOne({ user: _user.email })
                .then(_client => {
                  if(!_client) return reject(403);

                  EmailService.sendActivation(email)
                    .then(resolve)
                    .catch(reject);
                })
                .catch(err => {
                  sails.log.error(err);
                  return reject();
                });
            } else if(_user.role === 'Manager') {
              Manager.findOne({ user: _user.email })
                .then(_manager => {
                  if(!_manager) return reject(403);

                  EmailService.sendActivationStaff(email)
                    .then(resolve)
                    .catch(reject);
                })
                .catch(err => {
                  sails.log.error(err);
                  return reject();
                });
            } else {
              sails.log.error('Cant send activation email');
              return reject(403);
            }
          })
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
      });
    });
  }
};
