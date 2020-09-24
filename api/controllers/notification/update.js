'use strict';
/** @function
  @name update - Update notifications
  @memberof module:Notification
  @desc Route - {@linkcode PUT:/notification/:id}. Update form client it will set only `read` to true. From property manager it will set only `pickedUp` to true
  @returns Status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const id = req.param('id');

  if(isNaN(id)) return res.error({ errCode: 400, message: 'Id is not a number' });

  if(req.permission === 4) {
    NotificationService.updateByClient(id, req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else if (req.permission === 3) {
    NotificationService.updateByPropertyManager(id, req.token.userID)
      .then(res.ok)
      .catch(res.error);
  }  else {
    return res.error({ errCode: 403, message: 'Access denied' });
  }
};
