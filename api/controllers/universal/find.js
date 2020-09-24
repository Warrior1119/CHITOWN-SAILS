'use strict';
/** @function
  @name find - Find all training
  @desc Route - {@linkcode GET:/apple-app-site-association}
  @returns Ok - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
  @returns [Not found]{@link Not_found} Only if user/client/trainer doesn't exist
  @returns [Forbidden]{@link Forbidden} Only if user doesn't have buildingId
  @returns [Bad request]{@link Bad_request}
*/
module.exports = function find (req, res) {
  var fs = require('fs');
  var path = require('path');
  var appDir = path.dirname(require.main.filename);

  var file = fs.readFileSync(appDir + '/apple-app-site-association');
  res.set('content-type', 'application/json');

  res.status(200).send(file);
};
