'use strict';
/** @function
  @name find - Find all training
  @memberof module:Training
  @desc Route - {@linkcode GET:/training/clientHistory/:start/:end/:clientId/}
  @param {Number} start - Timestamp. `new Date('2017-04-04').getTime()`
  @param {Number} end - Timestamp. `new Date('2017-04-04').getTime()`
  @param {Number} clientId - Client ID
  @returns Ok - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
  @returns [Not found]{@link Not_found} Only if user/client/trainer doesn't exist
  @returns [Forbidden]{@link Forbidden} Only if user doesn't have buildingId
  @returns [Bad request]{@link Bad_request}
*/
module.exports = function find (req, res) {
  const data = {
    start: req.param('start'),
    end: req.param('end'),
    clientId: req.param('clientId'),
  };

  if(isNaN(data.start) || isNaN(data.end) || isNaN(data.clientId)) return res.error(400);

  if (req.permission === 4) {
    TrainingService.trainingClientHistoryOptional(data)
      .then(res.ok)
      .catch(res.error);
  } else return res.error(403);

};
