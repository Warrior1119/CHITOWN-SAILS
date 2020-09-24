'use strict';

/** @function
  @name checkIn
  @memberof module:Training
  @desc Route - {@linkcode PUT:/checkIn/:id}
  @param {Number} id - training ID
  @param {Array} clients - Array of clients ids. eg: [1,2,3,4]
  @returns noContent - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} User/Trainer not found
  @returns [Forbidden]{@link Forbidden} If training not belong to trainer
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  data.id = req.param("id");
  data.userID = req.token.userID;
  if(Utilities.isJSON(data.clients)) data.clients = JSON.parse(data.clients);

  if(!Array.isArray(data.clients)) return res.error({ errCode: 400, message: 'Missing clients array' });

  if(req.permission <= 1) {
    TrainingService.checkInByManager(data)
      .then(res.noContent)
      .catch(res.error);
  } else if (req.permission === 2) {
    TrainingService.checkInTrainer(data)
      .then(res.noContent)
      .catch(res.error);
  } else {
    return res.error({ errCode: 403 });
  }
};
