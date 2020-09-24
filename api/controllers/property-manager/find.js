'use strict';
/** @function
  @name find - Find all Properties managers
  @memberof module:PropertyManager
  @desc Route - {@linkcode GET:/propertyManager/all}
  @returns Find - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  PropertyManagerService.find()
    .then(res.ok)
    .catch(res.error);
};
