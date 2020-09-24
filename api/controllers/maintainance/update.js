'use strict';
/** @function
  @name setToDone
  @memberof module:Maintainance
  @desc Route - {@linkcode PUT:/maintainance/:id}. Avaible only for Property Manager
  @returns Status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const id = req.param('id');

  if(isNaN(id)) return res.error({ errCode: 400, message: 'Id is not a number' });

  if(req.permission === 3) {
    MaintainanceService.setToDone(id, req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else {
    return res.error({ errCode: 403, message: 'Access denied' });
  }
};
