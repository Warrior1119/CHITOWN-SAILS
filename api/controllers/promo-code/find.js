'use strict';
/** @function
  @name find - Find all promo codes
  @memberof module:PromoCode
  @desc Route - {@linkcode GET:/promocode}
  @returns Ok - status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  PromoCodeService.find()
    .then(res.ok)
    .catch(res.error);
};
