module.exports.routes = {
  'GET /analytics/sales/:start/:end/:type/:trainerId/:buildingId': 'analytics/sales',
  'GET /analytics/client/:start/:end/:reportType/:clientId/:trainerId/:buildingId': 'analytics/client',
  'GET /analytics/trainer/:start/:end/:reportType/:type/:trainerId': 'analytics/trainer'
};
