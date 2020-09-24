'use strict';
module.exports.routes = {
  'POST /client': 'client/create',
  'POST /manager/client': 'client/createbymanager',
  'POST /propertyManager/client': 'client/createbypropertymanager',
  'PUT /client': 'client/update',
  'PUT /client/:id': 'client/update',
  'PUT /client/switch': 'client/switch',
  'PUT /client/switch/:userID': 'client/switch',
  'GET /client/:id': 'client/findone',
  'GET /client/prospects': 'client/findprospect',
  'GET /client': 'client/findone',
  'GET /client/:skip/:limit': 'client/find',
  'GET /client/:skip/:limit/:buildingId/:trainerId': 'client/find',
  'GET /client/:skip/:limit/:buildingId/:trainerId/:query': 'client/find',
  'DELETE /client/:id': 'client/destroy'
};
