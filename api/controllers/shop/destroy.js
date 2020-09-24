'use strict';
/** @function
  @name destroy - Destroy shop product
  @memberof module:Shop
  @desc Route - {@linkcode DELETE:/shop/:id}
  @param {Number} id
  @returns No content - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Not Found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  const id = req.param('id');

  if(Utilities.isNumeric(id)) {
    ShopItemService.destroy(id)
      .then(res.noContent)
      .catch(res.error);
  } else {
    return res.error(400);
  }
};
