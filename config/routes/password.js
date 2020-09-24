module.exports.routes = {
  'GET /password/:email': 'password/remind',
  'GET /password/:email/:hash': 'password/validate-hash',
  'PUT /password/:email': 'password/reset'
};
