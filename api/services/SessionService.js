'use strict';
module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: data.email })
        .then(_user => {
          if(!_user) return reject(404);

          User.comparePassword(data.password, _user)
            .then(() => resolve({
              token: jwToken.issue({ userID: _user.id }),
              role: _user.role
            }))
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
