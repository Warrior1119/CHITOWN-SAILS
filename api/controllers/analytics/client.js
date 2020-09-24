'use strict';

/** @function
  @name client
  @memberof module:Analytics
  @desc Route - {@linkcode GET/analytics/client/:start/:end/:reportType/:clientId/:trainerId/:buildingId}
  @param {Number} start - Timestamp
  @param {Number} end - Timestamp
  @param {String} reportType - Name of report.Possible values: [attendance, remaining or 0]
  @param {Number} clientId - Set 0 to omit.
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
    reportType: req.param('reportType'),
    clientId: req.param('clientId'),
    trainerId: req.param('trainerId'),
    buildingId: req.param('buildingId')
  };

  ValidService.valid(data, 'ClientAnalytics')
    .then(() => {
      ClientAnalyticsService.analyze(data)
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
