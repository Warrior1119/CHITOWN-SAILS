'use strict';

/** @function
  @name confirm
  @memberof module:Shop
  @desc Route - {@linkcode GET:/shop/buy/valid/:skuId/:giftCard/:promoCode}
  @param {Number} skuId
  @param {String} [giftCard] - Hash of giftCard
  @param {String} [promoCode] - Hash of promo code
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Forbidden]{@link Forbidden}
  @returns [Server error]{@link Server_error}
  @returns [Stripe error]{@link Stripe_error}
*/
module.exports = function create (req, res) {
  const data = {
    skuId: req.param('skuId'),
    giftCard: req.param('giftCard'),
    promoCode: req.param('promoCode'),
    userID: req.token.userID
  };

  ShopItemService.confirm(data)
    .then(res.ok)
    .catch(res.error);
};
