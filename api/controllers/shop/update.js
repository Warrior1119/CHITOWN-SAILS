'use strict';
/** @function
  @name update - Update shop product
  @memberof module:Shop
  @desc Route - {@linkcode PUT:/shop/:id}
  @param {Number} id
  @param {Object} data
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not Found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  data.id = req.param('id');

  Utilities.prepareData(data, req.permission, 'Shop')
    .then(data => {
      ValidService.valid(data, 'Shop', true)
        .then(() => {
          return ShopItemService.update(data, req);
        })
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
