'use strict';
module.exports.routes = {
  'POST /measurements': 'measurements/create',
  'PUT /measurements/:id': 'measurements/update',
  'GET /measurements/:start/:end/:clientId': 'measurements/find',
  'GET /measurements/:start/:end': 'measurements/find'
};
