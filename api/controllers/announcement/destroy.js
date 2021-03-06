'use strict';
/** @function
  @name destroy - Destory Announcement
  @memberof module:Announcement
  @desc Route - {@linkcode DEL:/announcement/:id}
  @returns Status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function (req, res) {
  const id = req.param('id');
  if(isNaN(id)) return res.error({ errCode: 400, message: 'Id is not a number' });

  if(req.permission === 3 || req.permission <= 1) {
    AnnouncementService.destroy(id, req.token.userID)
      .then(res.ok)
      .catch(res.error);
  }  else {
    return res.error({ errCode: 403, message: 'Access denied' });
  }
};
