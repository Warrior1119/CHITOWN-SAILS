'use strict';
module.exports.routes = {
  'POST /building': 'building/create',
  'GET /building/:skip/:limit': 'building/find',
  'GET /building': 'building/find',
  'GET /building/:id': 'building/findone',
  'PUT /building': 'building/update',
  'PUT /building/:id': 'building/update',
  'DELETE /building/:id': 'building/destroy'
};
