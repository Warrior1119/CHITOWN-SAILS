'use strict';
module.exports.routes = {
  'POST /booking-type': 'booking-type/create',
  'GET /booking-type/:page': 'booking-type/find',
  'GET /booking-type': 'booking-type/find',
  'PUT /booking-type/:id': 'booking-type/update',
  'DELETE /booking-type/:id': 'booking-type/destroy',
};
