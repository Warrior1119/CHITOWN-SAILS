'use strict';
/** @function
  @name destroy - Destroy promo code
  @memberof module:PromoCode
  @desc Route - {@linkcode DEL:/promocode/:hash}
  @param {String} hash
  @returns No content - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  const data = req.param("hash");

  if(data === undefined || data === null) return res.error(400);

  PromoCodeService.destroy(data)
    .then(res.noContent)
    .catch(res.error);
};
