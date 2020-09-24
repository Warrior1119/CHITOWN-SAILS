'use strict';

/** @function
  @name buy - buy item from shop
  @memberof module:Shop
  @desc Route - {@linkcode POST:/shop/buy}
  @param {Number} skuId
  @param {String} cardToken
  @param {Email} [recipient] - Required only if buying gift by client
  @param {String} [message] - Required only if buying gift by client
  @param {String} [giftCard] - Hash of giftCard
  @param {String} [promoCode] - Hash of promo code
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} if user/client/sku not exist, if sku/product isn't active
  @returns [Forbidden]{@link Forbidden} gftCard / promoCode doesnt exist or expired or GIft not belong to user
  @returns [Server error]{@link Server_error}
  @returns [Stripe error]{@link Stripe_error}
*/
module.exports = function create (req, res) {
  const data = req.body;
  data.userID = req.token.userID;

  Utilities.prepareData(data, req.permission, 'Buy')
    .then(data => {
      ValidService.valid(data, 'Buy')
        .then(() => {
          return ShopItemService.buy(data, req);
        })
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
