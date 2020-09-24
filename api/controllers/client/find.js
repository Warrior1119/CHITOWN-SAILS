'use strict';

/** @function
  @name find - Find all clients
  @memberof module:Client
  @desc Route - {@linkcode GET:/client/:skip/:limit/:buildingId/:trainerId/:query}
  @param {Number} skip
  @param {Number} limit
  @param {Number} [buildingId] - Only for Manager/Admin. Set 0 if u want to omit this param
  @param {Number} [trainerId] - Olny for Manager/Admin. Set 0 if u want to omit this param
  @param {String} [query] - Olny for Manager/Admin. Searching by: firstName, lastName, email
  @returns Find - status 200. They will be sorted from newest
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} Trainer with that token doesn't exist
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const data = {
    start: req.param('skip'),
    end: req.param('limit'),
    buildingId: req.param('buildingId'),
    trainerId: req.param('trainerId'),
    query: req.param('query')
  };

  if(isNaN(data.start) || isNaN(data.end)) return res.error(400);
  //if(isNaN(data.start) || isNaN(start.end)) return res.error(400);

  if (req.permission === 3) {
    data.userID = req.token.userID;

    ClientService.findByPropertyManager(data)
      .then(res.ok)
      .catch(res.error);
  } else if (req.permission === 2) {
    data.userID = req.token.userID;

    ClientService.findByTrainer(data)
      .then(res.ok)
      .catch(res.error);
  } else {
    ClientService.find(data)
      .then(res.ok)
      .catch(res.error);
  }

};
