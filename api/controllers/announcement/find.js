'use strict';
/** @function
  @name find - Find announcement
  @memberof module:Announcement
  @desc Route - {@linkcode GET:/announcement/:page} or  {@linkcode GET:/announcement} for client
  @param {Number} page - Number of page
  @returns Find - status 200 with content
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const page = req.param('page');

  if(req.permission === 4) {
    AnnouncementService.findByClient(req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else if (req.permission <= 1 || req.permission === 3) {
    if(isNaN(page)) return res.error({ errCode: 400, message: 'Page is not a number' });
    AnnouncementService.find(page, req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else {
    return res.error({ errCode: 403, message: 'Access denied' });
  }
};
