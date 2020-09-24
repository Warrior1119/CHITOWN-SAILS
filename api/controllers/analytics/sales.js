'use strict';
/** @module Analytics*/

/** @function
  @name sails
  @memberof module:Analytics
  @desc Route - {@linkcode GET:/analytics/sales/:start/:end/:type/:trainerId/:buildingId}
  @param {Number} start - Timestamp
  @param {Number} end - Timestamp
  @param {String} type - Name of service. Set 0 to omit.
  @param {Number} trainerId - Set 0 to omit.
  @param {String} buildingId - Set 0 to omit.
  @returns Ok - status 200 with array
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function sales (req, res) {
  const data = {
    start: req.param('start'),
    end: req.param('end'),
    type: req.param('type'),
    trainerId: req.param('trainerId'),
    buildingId: req.param('buildingId')
  };

  ValidService.valid(data, 'Sales')
    .then(() => {
      SalesService.analyze(data)
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
