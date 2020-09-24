'use strict';
/** @module Diet*/

/** @function
  @name add-diet - add diet for client
  @memberof module:Diet
  @desc Route - {@linkcode POST:/diet/add}
  @param {Number} clientId
  @param {Number} skuId
  @param {File} diet
  @returns ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} Client, Sku not found
  @returns [Server error]{@link Server_error}
*/
module.exports = function (req, res) {
  const data = req.body;

  if(!data.clientId) return res.error({ errCode: 400, message: 'Client id required' });
  if(!data.skuId) return res.error({ errCode: 400, message: 'Sku id required' });
  data.diet = req.file('diet');

  DietService.addDiet(data)
    .then(res.ok)
    .catch(res.error);
};
