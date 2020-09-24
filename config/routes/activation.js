module.exports.routes = {
  'GET /activation/:email/:hash': 'activation/findone',
  'GET /activation/resend/:email': 'activation/resend'
};
