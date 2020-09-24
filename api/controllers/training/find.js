'use strict';
/** @function
  @name find - Find all training
  @memberof module:Training
  @desc Route - {@linkcode GET:/training/:start/:end/:type}
  @param {Number} start - Timestamp. `new Date('2017-04-04').getTime()`
  @param {Number} end - Timestamp. `new Date('2017-04-04').getTime()`
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
    userID: req.token.userID
  };

  if(isNaN(data.start) || isNaN(data.end)) return res.error(400);

  if(req.permission === 4) {
    if(data.type) {
      TrainingService.trainingClientHistory(data)
        .then(res.ok)
        .catch(res.error);
    } else {
      TrainingService.findByClient(data)
        .then(res.ok)
        .catch(res.error);
    }
  } else if(req.permission === 3) {
    TrainingService.findByPropertyManager(data)
      .then(res.ok)
      .catch(res.error);
  } else if(req.permission === 2) {
    TrainingService.findByTrainer(data)
      .then(res.ok)
      .catch(res.error);
  } else {
    TrainingService.find(data)
      .then(res.ok)
      .catch(res.error);
  }
};
