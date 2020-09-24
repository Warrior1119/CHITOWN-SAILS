'use strict';
/** @function
  @name destroy - destroy client
  @memberof module:Client
  @desc Route - {@linkcode DEL:/client/:id}
  @param {number} id - UserID, It must be user ID, not client ID
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
  const id = req.param("id");

  if(isNaN(id)) return res.error({ errCode: 404, message: 'ID is not a number' });

  if(req.permission === 3) {
    ClientService.destroyByPropertyManager(id, req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else if(req.permission <= 1) {
    ClientService.destroy(id)
      .then(res.ok)
      .catch(res.error);
  } else {
    return res.error({ errCode: 403, message: 'Access denied' });
  }
};
