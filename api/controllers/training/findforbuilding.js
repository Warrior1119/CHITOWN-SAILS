'use strict';
/** @function
  @name findForBuilding - Find all training in building
  @memberof module:Training
  @desc Route - {@linkcode GET:/training-for-building/:start/:end/:buildingCode}
  @param {Number} start - Timestamp. `new Date('2017-04-04').getTime()`
  @param {Number} end - Timestamp. `new Date('2017-04-04').getTime()`
  @param {Number} buildingCode
  @returns Ok - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
  @returns [Bad request]{@link Bad_request}
*/
module.exports = function find (req, res) {
  const data = {
    start: req.param('start'),
    end: req.param('end'),
    buildingCode: req.param('buildingCode')
  };

  if(isNaN(data.start) || isNaN(data.end)) return res.error(400);

  TrainingService.findForBuilding(data)
    .then(res.ok)
    .catch(res.error);
};
