'use strict';
module.exports.routes = {
  'POST /neighbourhood': 'neighbourhood/create',
  'GET /neighbourhood': 'neighbourhood/find',
  'GET /neighbourhood/:id': 'neighbourhood/findone',
  'PUT /neighbourhood/': 'neighbourhood/update',
  'PUT /neighbourhood/:id': 'neighbourhood/update',
  'DELETE /neighbourhood/:id': 'neighbourhood/destroy'
};
