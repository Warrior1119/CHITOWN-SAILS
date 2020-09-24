'use strict';
/** @function
  @name assessment
  @memberof module:Training
  @desc Route - {@linkcode GET:/assessment}
  @returns noContent - status 204
  @returns [Server error]{@link Server_error}
  @returns [Not found]{@link Not_found} Only if user/client/trainer doesn't exist
  @returns [Bad request]{@link Bad_request}
*/
module.exports = function find (req, res) {
  TrainingService.createAssessment(req.token.userID)
    .then(res.noContent)
    .catch(res.error);
};
