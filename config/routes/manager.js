'use strict';

module.exports.routes = {
  'POST /manager': 'manager/create',
  'PUT /manager/:id': 'manager/update',
  'PUT /manager': 'manager/update',
  'GET /manager/:id': 'manager/findone',
  'GET /manager': 'manager/findone',
  'GET /manager/:start/:end': 'manager/find',
  'DELETE /manager/:id': 'manager/destroy'
};
