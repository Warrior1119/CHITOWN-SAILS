'use strict';
/** @function
  @name find - Find one promo code
  @memberof module:PromoCode
  @desc Route - {@linkcode GET:/promocode/:hash}
  @returns Ok - status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  PromoCodeService.findOne(req.param('hash'))
    .then(res.ok)
    .catch(res.error);
};
