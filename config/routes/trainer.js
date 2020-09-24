module.exports.routes = {
  'POST /trainer': 'trainer/create',
  'PUT /trainer/:id': 'trainer/update',
  'PUT /trainer': 'trainer/update',
  'GET /trainer/:id': 'trainer/findone',
  'GET /trainer': 'trainer/findone',
  'GET /trainer/all': 'trainer/find'
};
