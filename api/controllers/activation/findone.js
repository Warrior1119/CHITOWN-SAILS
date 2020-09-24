'use strict';
/** @module Activation*/

/** @function
  @name findone - Activate client account
  @memberof module:Activation
  @desc Route - {@linkcode GET:/activation/:email/:hash}
  @param {String} email
  @param {String} hash
  @returns Created - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Unauthorized]{@link Unauthorized}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
  const data = {
    email: req.param('email'),
    hash: req.param('hash')
  };
  ValidService.valid(data, 'Activation')
    .then(() => {
      ActivationService.activate(data)
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);

};
