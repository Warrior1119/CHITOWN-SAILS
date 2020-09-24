'use strict';

/** @function
  @name trainer
  @memberof module:Analytics
  @desc Route - {@linkcode GET/analytics/trainer/:start/:end/:reportType/:type/:trainerId}
  @param {Number} start - Timestamp
  @param {Number} end - Timestamp
  @param {String} reportType - Name of report.Possible values: [payroll, performance, sessions]
  @param {String} type - Type of training. Set 0 to omit.
  @param {Number} trainerId - Set 0 to omit.
  @returns Ok - status 200 with array
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function sales (req, res) {
  const data = {
    start: req.param('start'),
    end: req.param('end'),
    reportType: req.param('reportType'),
    type: req.param('type'),
    trainerId: req.param('trainerId')
  };

  ValidService.valid(data, 'TrainerAnalytics')
    .then(() => {
      TrainerAnalyticsService.analyze(data)
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
