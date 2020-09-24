'use strict';
/** @module Schedule*/

/** @function
  @name find - Find all schedules
  @memberof module:Schedule
  @desc Route - {@linkcode GET:/schedule/:start/:end}
  @param {Number} start - Timestamp. `new Date('2017-04-04').getTime()`
  @param {Number} end - Timestamp. `new Date('2017-04-04').getTime()`
  @returns Find - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
  @returns [Bad request]{@link Bad_request}
*/
module.exports = function find (req, res) {
  const data = {
    start: req.param('start'),
    end: req.param('end'),
    userID: req.token.userID
  };

  if(req.permission !== 4) return res.error(403);
  if(isNaN(data.start) || isNaN(data.end)) return res.error(400);

  ScheduleService.find(data)
    .then(res.ok)
    .catch(res.error);
};
