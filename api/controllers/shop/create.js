'use strict';
/** @module Shop*/

/** @function
  @name create - Create product in shop
  @memberof module:Shop
  @desc Route - {@linkcode POST:/shop}
  @param {String} name
  @param {String} [icon]
  @param {String} [color]
  @param {String} description
  @param {String} category
  @param {Boolean} personal
  @param {File} [imageInCategory]
  @param {File} [image]
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict}
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;

  Utilities.prepareData(data, req.permission, 'Shop')
    .then(data => {
      ValidService.valid(data, 'Shop')
        .then(() => {
          return ShopItemService.create(data, req);
        })
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
