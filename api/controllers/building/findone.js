'use strict';
/** @function
  @name findOne - find one building
  @memberof module:Building
  @desc Route - {@linkcode GET:/building/:id}
  @param {number} [id]- Id of building. Required for Admin/Manager
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
  if(req.permission === 2) return res.error({ errCode: 403, message: 'Access denied' });

  if(req.permission === 3) {
    BuildingService.findOneByPropertyManager(req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else {
    const id = req.param('id');
    if(isNaN(id)) return res.error({ errCode: 400, message: 'Id should be number' });
    BuildingService.findOne(id)
      .then(res.ok)
      .catch(res.error);
  }
};
