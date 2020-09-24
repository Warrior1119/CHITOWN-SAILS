'use strict';

module.exports.routes = {
  'POST /shop': 'shop/create',
  'POST /shop/buy': 'shop/buy',
  'PUT /shop/:id': 'shop/update',
  'DELETE /shop/:id': 'shop/destroy',
  'GET /shop': 'shop/find',
  'GET /shop/buy/valid/:skuId/:giftCard/:promoCode': 'shop/confirm-purchase',
  'GET /shop/diet': 'shop/find-diets'
};
