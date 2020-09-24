'use strict';
module.exports.routes = {
  'GET /product/:id': 'product/findone',
  'GET /product/client/:id': 'product/find',
  'GET /product': 'product/find',
  'POST /product/add': 'product/add-session'
};
