'use strict';

/** @function
  @name find - Find all measurements
  @memberof module:Measurements
  @desc Route - {@linkcode GET:/measurements/:start/:end/:clientId}
  @param {Timestamp} start
  @param {Timestamp} end
  @param {Number} [clientId] - Only when req not belong to client
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} Client not found
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const data = {
    start: req.param('start'),
    end: req.param('end'),
    clientId: req.param('clientId'),
    userID: req.token.userID
  };

  if(req.permission === 4) {
    MeasurementsService.findByClient(data)
      .then(res.ok)
      .catch(res.error);
  } else {
    MeasurementsService.find(data)
      .then(res.ok)
      .catch(res.error);
  }
};
