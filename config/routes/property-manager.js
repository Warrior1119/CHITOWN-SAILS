'use strict';

module.exports.routes = {
  'POST /propertyManager': 'property-manager/create',
  'PUT /propertyManager/:id': 'property-manager/update',
  'PUT /propertyManager': 'property-manager/update',
  'GET /propertyManager/:id': 'property-manager/findone',
  'GET /propertyManager': 'property-manager/findone',
  'GET /propertyManager/all': 'property-manager/find'
};
