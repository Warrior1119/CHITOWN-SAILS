'use strict';

module.exports.routes = {
  'POST /maintainance': 'maintainance/create',
  'PUT /maintainance/:id': 'maintainance/update',
  'GET /maintainance/:page': 'maintainance/find',
};
