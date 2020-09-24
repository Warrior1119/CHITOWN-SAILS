'use strict';
/** @function
  @name reset - reset password
  @memberof module:Password
  @desc Route - {@linkcode PUT:/password/:email}
  @param {String} email
  @param {String} hash
  @param {String} password
  @returns Ok - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} - User not found
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = {
    email: req.param('email'),
    hash: req.param('hash'),
    password: req.param('password')
  };
  if(!data.password) return res.error(400);
  if(!Utilities.isEmail(data.email)) return res.error(400);

  PasswordService.validateHash({ email: data.email, hash: data.hash })
    .then(() => {
      PasswordService.reset(data)
        .then(res.noContent)
        .catch(res.error);
    })
    .catch(res.error);
};
