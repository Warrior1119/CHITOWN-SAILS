'use strict';
module.exports.routes = {
  'POST /book': 'book/create',
  'GET /book': 'book/find',
  'GET /book/:id': 'book/findOne',
  'PUT /book/:id': 'book/update',
  'DELETE /book/:id': 'book/destroy',
};
