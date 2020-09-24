'use strict';
/** @function
  @name destroy - Destroy sku
  @memberof module:Sku
  @desc Route - {@linkcode DEL:/sku/:id}
  @param {String} id - id of sku
  @returns No content - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  const id = req.param('id');

  SkuService.destroy(id)
    .then(res.noContent)
    .catch(res.error);

};
