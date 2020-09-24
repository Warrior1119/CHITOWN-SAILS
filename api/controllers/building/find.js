'use strict';
/** @function
  @name find - Find all buildings
  @memberof module:Building
  @desc Route - {@linkcode GET:/building/:skip/:limit}
  @returns Find - status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  BuildingService.find()
    .then(res.ok)
    .catch(res.error);
};
