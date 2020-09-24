'use strict';
/** @module PromoCode*/

/** @function
  @name create - Create PromoCode
  @memberof module:PromoCode
  @desc Route - {@linkcode POST:/promocode}
  @param {String} [hash]
  @param {Number} quantity
  @param {Number} discountAmount
  @param {String} discountType - percentage or value
  @param {Boolean} active
  @param {Boolean} [all] - Default: false. If true then product array should be empty or should not passed
  @param {Array} products - should contain ids of products(not skus, just products)
  @param {Timestamp} expDate
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict} - hash already exist
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {
  const data = req.body;
  if(Utilities.isJSON(data.products)) data.products = JSON.parse(data.products);

  Utilities.prepareData(data, req.permission, 'PromoCode')
    .then(data => {

      ValidService.valid(data, 'PromoCode')
        .then(() => {
          return PromoCodeService.create(data);
        })
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
