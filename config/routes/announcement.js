'use strict';
module.exports.routes = {
  'POST /announcement': 'announcement/create',
  'GET /announcement/:page': 'announcement/find',
  'GET /announcement': 'announcement/find',
  'PUT /announcement/:id': 'announcement/update',
  'DELETE /announcement/:id': 'announcement/destroy'
};
