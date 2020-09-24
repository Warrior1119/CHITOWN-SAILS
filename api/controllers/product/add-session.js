'use strict';

/** @function
  @name add - add one product
  @memberof module:Product
  @desc Route - {@linkcode POST:/product/add}
  @param {Number} clientId
  @param {Number} skuId
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} Client, Sku not found
  @returns [Server error]{@link Server_error}
*/
module.exports = function findOne (req, res) {
  const data = req.body;

  if(!data.clientId) return res.error({ errCode: 400, message: 'Client id required' });
  if(!data.skuId) return res.error({ errCode: 400, message: 'Sku id required' });

  ProductService.addSessions(data)
    .then(res.ok)
    .catch(res.error);

};
