'use strict';
/** @module Password*/

/** @function
  @name remind - Send link to generate new password
  @memberof module:Password
  @desc Route - {@linkcode GET:/password/:email}
  @param {String} email
  @returns Ok - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} - User not found
  @returns [Froridden]{@link Froridden} - Client was registered through facebook
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.param("email");

  if(!Utilities.isEmail(data)) return res.error(400);

  PasswordService.remind(data)
    .then(res.noContent)
    .catch(res.error);
};
