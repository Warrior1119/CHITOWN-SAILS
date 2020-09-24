'use strict';
/** @module Manager*/

/** @function
  @name create - Create manager
  @memberof module:Manager
  @desc Route - {@linkcode POST:/manager}
  @param {String} firstName
  @param {String} lastName
  @param {String} email
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict}
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {
  const data = req.body;

  Utilities.prepareData(data, req.permission, 'Manager')
    .then(data => {
      User.findOne({ email: data.email })
        .then(user => {
          if(user) return res.error({ errCode: 409, message: 'User with this email already exist' });
          data.role = 'Manager';
          ValidService.valid(data, 'Manager')
            .then(() => {
              data.avatar = req.file('avatar');
              UserService.create(data)
                .then(res.created)
                .catch(res.error);
            })
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
