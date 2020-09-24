'use strict';
/** @function
  @name update - Update sku
  @memberof module:Sku
  @desc Route - {@linkcode PUT:/sku/:id}
  @param {String} id - id of sku
  @param {Object} data
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  data.id = req.param("id");

  Utilities.prepareData(data, req.permission, 'Sku')
    .then(data => {
      ValidService.valid(data, 'Sku', true)
        .then(() => {
          return SkuService.update(data);
        })
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
