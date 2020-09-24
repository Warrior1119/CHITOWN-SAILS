'use strict';
/** @function
  @name find - Find notifications
  @memberof module:Notification
  @desc Route - {@linkcode GET:/notification/:page/:type}
  @param {Number} page - Number of page
  @param {Number} type - Avaible values: All or Pack. This option is only for Property Manager and client
  @returns Find - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  if (!req.param('page')) {
    if (req.permission === 0) {
      return NotificationService.find().then(res.ok).catch(res.error);
    }
  }
  const data = {
    page: req.param('page'),
    type: req.param('type'),
  };

  if(isNaN(data.page)) return res.error({ errCode: 400, message: 'Page is not a number' });

  if(req.permission === 4) {
    if(![ 'All', 'Pack' ].includes(data.type))
      return res.error({ errCode: 400, message: 'Only avaible types like "All" or "Pack". You sent: ' + data.type });

    NotificationService.findByClient(data.type, data.page, req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else if (req.permission === 3) {
    if(![ 'All', 'Pack' ].includes(data.type))
      return res.error({ errCode: 400, message: 'Only avaible types like "All" or "Pack". You sent: ' + data.type });

    NotificationService.findByPropManager(data.type, data.page, req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else if (req.permission <= 1) {
    NotificationService.find(data.type, data.page)
      .then(res.ok)
      .catch(res.error);
  } else {
    return res.error({ errCode: 403, message: 'Access denied' });
  }
};
