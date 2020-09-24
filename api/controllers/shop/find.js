'use strict';
/** @function
  @name Find - Find all shop products
  @memberof module:Shop
  @desc Route - {@linkcode GET:/shop}
  @returns Ok - status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  if(req.permission > 2) {
    ShopItemService.findForClient(req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else {
    ShopItemService.find()
      .then(res.ok)
      .catch(res.error);
  }
};
