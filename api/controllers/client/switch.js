'use strict';
/** @function
  @name switch - Switch client to prospect
  @memberof module:Client
  @desc Route - {@linkcode PUT:/client/switch/:userID}
  @param {Number} userID - Require only for manager. User client id. Not client ID, just USER id
  @returns noContent - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Forbidden]{@link Forbidden}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = (req, res) => {
  let userID;

  if(req.permission === 4) userID = req.token.userID;
  else userID = req.param('userID');

  if(!userID) return res.error(400);

  ClientService.switchTag(userID, req.permission)
    .then(res.noContent)
    .catch(res.error);
};
