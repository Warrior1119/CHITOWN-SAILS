'use strict';
/** @function
  @name find-prospect - Find all prospects clients
  @memberof module:Client
  @desc Route - {@linkcode GET:/client/prospects}
  @returns Find - status 200. They will be sorted from newest
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  ClientService.findProspects()
    .then(res.ok)
    .catch(res.error);
};
