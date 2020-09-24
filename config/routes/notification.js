'use strict';
module.exports.routes = {
  'POST /notification': 'notification/create',
  'GET /notification/': 'notification/find',
  'GET /notification/:page': 'notification/find',
  'GET /notification/:page/:type': 'notification/find',
  'PUT /notification/:id': 'notification/update',
};
