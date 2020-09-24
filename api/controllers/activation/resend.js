'use strict';
/** @function
  @name resend - resend activation email
  @memberof module:Activation
  @desc Route - {@linkcode GET:/activation/resend/:email}
  @param {String} email
  @returns Created - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Forbidden]{@link Forbidden} user account was deactivated by Manager/Admin
  @returns [Server error]{@link Server_error}
*/
module.exports = function resend (req, res) {
  const email = req.param('email');
  ActivationService.resend(email)
    .then(res.ok)
    .catch(res.error);
};
