'use strict';
/** @function
  @name destroy - Destroy building
  @memberof module:Building
  @desc Route - {@linkcode DEL:/building/:id}
  @param {number} id - id of building
  @returns No content - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  const data = req.param('id');

  if(!data) return res.error(400);

  BuildingService.destroy(data)
    .then(res.noContent)
    .catch(res.error);
};
