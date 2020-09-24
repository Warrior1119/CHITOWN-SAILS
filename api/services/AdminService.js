'use strict';

module.exports = {
  getDashboard (userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject(404);

          return Administrator.findOne({ user: _user.email }).populateAll();
        })
        .then(_admin => {
          if(!_admin) return reject(404);

          return resolve(_admin);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
