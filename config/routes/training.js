'use strict';
module.exports.routes = {
  'POST /training': 'training/create',
  'POST /propertyManager/training': 'training/createbypropertymanager',
  'POST /training/notify/:id': 'training/notifyparticipants',
  'PUT /training/:id': 'training/update',
  'PUT /training/:id/all': 'training/update',
  'PUT /propertyManager/training/:id': 'training/updatebypropertymanager',
  'PUT /checkIn/:id': 'training/checkin',
  'GET /training/:start/:end': 'training/find',
  'GET /assessment': 'training/assessment',
  'GET /training/:start/:end/:type': 'training/find',
  'GET /training/clientHistory/:start/:end/:clientId/:type': 'training/findclienthistory',
  'GET /training/clientHistory/:start/:end/:clientId': 'training/findclienthistoryoptionaltype',
  'GET /training-for-building/:start/:end/:buildingCode': 'training/findforbuilding',
  'DELETE /training/:id': 'training/destroy',
  'DELETE /training/:id/:all': 'training/destroy'
};
