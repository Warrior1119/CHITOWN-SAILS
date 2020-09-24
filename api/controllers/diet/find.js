'use strict';

/** @function
  @name find - Find all client diets
  @memberof module:Diet
  @desc Route:
   For client - {@linkcode GET:/diet}
   For others - {@linkcode GET:/diet/:clientId}
  @param {Number} clientId
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const clientId = req.param('clientId');

  if(req.permission === 4) {
    DietService.findForClient(req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else {
    if(!Utilities.isNumeric(clientId)) return res.error(400);

    DietService.find(clientId)
      .then(res.ok)
      .catch(res.error);
  }

};
