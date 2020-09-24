'use strict';
/** @function
  @name destroy - Destroy building
  @memberof module:Neighbourhood
  @desc Route - {@linkcode DEL:/Neighbourhood/:id}
  @param {number} id - id of building
  @returns No content - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/

module.exports = function destroy (req, res) {
  const data = req.param('id');

  if (!data) return res.error(400);

  if (req.permission === 2 || req.permission === 4) return res.error({ errCode: 403, message: 'Access denied' });
  else {
    NeighbourhoodService.destroy(data)
      .then(res.noContent)
      .catch(res.error);
  }
};
