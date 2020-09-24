'use strict';
/** @function
  @name Find - Find all diet plans
  @memberof module:Shop
  @desc Route - {@linkcode GET:/shop/diet}
  @returns Ok - status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  if(req.permission >= 2) {
    ShopItemService.findDietsForClient(req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else {
    ShopItemService.findDiets()
      .then(res.ok)
      .catch(res.error);
  }
};
