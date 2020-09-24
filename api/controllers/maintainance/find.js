'use strict';
/** @function
  @name find - Find Maintainance
  @memberof module:Maintainance
  @desc Route - {@linkcode GET:/maintainance/:page}
  @param {Number} page - Number of page
  @returns Find - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const page = req.param('page');

  if(isNaN(page)) return res.error({ errCode: 400, message: 'Page should be a number' });

  MaintainanceService.find(page, req.token.userID)
    .then(res.ok)
    .catch(res.error);
};
