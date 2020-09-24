'use strict';
/** @module Training_types*/

/** @function
  @name find - Find all training types
  @memberof module:Training_types
  @desc Route - {@linkcode GET:/training-type}
  @returns Ok - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {

  TrainingTypeService.find()
    .then(res.ok)
    .catch(res.error);
};
