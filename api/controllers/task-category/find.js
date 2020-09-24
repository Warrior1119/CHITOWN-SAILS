'use strict';
/** @module Task-Category*/

/** @function
  @name find - Find all task categories
  @memberof module:Task-Category
  @desc Route - {@linkcode GET:/task-category/all}
  @returns Ok - status 200 with array
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  TaskService.findCategories()
    .then(res.ok)
    .catch(res.error);
};
