module.exports.routes = {
  'POST /task': 'task/create',
  'PUT /task/:id': 'task/update',
  'GET /task/:id': 'task/findone',
  'GET /task/:start/:end': 'task/find',
  'GET /task/:start/:end/:user': 'task/find',
  'GET /task/:start/:end/:user/:category': 'task/find',
  'GET /task/:start/:end/:user/:category/:priority': 'task/find',
  'DELETE /task/:id': 'task/destroy'
};
