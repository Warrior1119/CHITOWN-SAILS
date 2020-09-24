'use strict';
/** @module Sku */

/** @function
  @name create - Create sku
  @memberof module:Sku
  @desc Route - {@linkcode POST:/sku}
  @param {String} name
  @param {String} productId
  @param {Number} cost - In $$$
  @param {Number} [duration]
  @param {Number} [quantity] - Default to: 1
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} - productId not found
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;

  Utilities.prepareData(data, req.permission, 'Sku')
    .then(data => {
      ValidService.valid(data, 'Sku')
        .then(() => {
          return SkuService.create(data);
        })
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
