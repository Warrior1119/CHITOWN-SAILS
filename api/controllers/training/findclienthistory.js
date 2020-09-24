'use strict';
/** @function
  @name find - Find all training
  @memberof module:Training
  @desc Route - {@linkcode GET:/training/clientHistory/:start/:end/:clientId/:type}
  @param {Number} start - Timestamp. `new Date('2017-04-04').getTime()`
  @param {Number} end - Timestamp. `new Date('2017-04-04').getTime()`
  @param {Number} clientId - Client ID
  @param {Number} type - Name of product
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
    type: req.param('type'),
    clientId: req.param('clientId'),
  };

  if(isNaN(data.start) || isNaN(data.end) || isNaN(data.clientId)) return res.error(400);

  TrainingService.trainingClientHistoryByManager(data)
    .then(res.ok)
    .catch(res.error);

};
