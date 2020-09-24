'use strict';

/** @module Admin*/

/** @function
  @name findOne - Get dashboard admin
  @memberof module:Admin
  @desc Route - {@linkcode GET:/admin}
  @returns OK - status 200
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
  AdminService.getDashboard(req.token.userID)
    .then(res.ok)
    .catch(res.error);
};
