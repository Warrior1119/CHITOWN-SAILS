'use strict';
/** @function
  @name findOne - find one schedule
  @memberof module:Schedule
  @desc Route - {@linkcode GET:/schedule/:id}
  @param {number} id
  @returns OK - status 200 with data
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
  const data = {
    id: req.param("id"),
    userID: req.token.userID
  };


  if(req.permission !== 4) return res.error(403);
  if(isNaN(data.id) || !_.isFinite(Number(data.id))) return res.error(400);

  ScheduleService.findOne(data)
    .then(res.ok)
    .catch(res.error);
};
