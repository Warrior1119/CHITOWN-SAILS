'use strict';

module.exports.routes = {
  'POST /promocode': 'promo-code/create',
  'DELETE /promocode/:hash': 'promo-code/destroy',
  'GET /promocode': 'promo-code/find',
  'GET /promocode/:hash': 'promo-code/findone'
};
