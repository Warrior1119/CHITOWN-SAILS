'use strict';
/** @module Health*/

/** @function
 @name status - Check application status
 @memberof module:Health
 @desc Route - {@linkcode GET:/health/status}
 @returns Ok - status 200
 */
module.exports = function status (req, res) {
  return res.ok();
};
