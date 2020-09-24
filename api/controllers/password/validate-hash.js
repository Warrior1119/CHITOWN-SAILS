'use strict';
/** @function
  @name validate-hash - validate hash for reset password
  @memberof module:Password
  @desc Route - {@linkcode GET:/password/:email/:hash}
  @param {String} email
  @param {String} hash
  @returns Ok - status 204
  @returns [Bad request]{@link Bad_request} - Missmatch hash or wrong email
  @returns [Not found]{@link Not_found} - Hash doesn't exist or Hash expired
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = {
    email: req.param('email'),
    hash: req.param('hash')
  };

  if(!Utilities.isEmail(data.email)) return res.error(400);

  PasswordService.validateHash(data)
    .then(res.noContent)
    .catch(res.error);
};
