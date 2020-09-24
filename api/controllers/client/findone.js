'use strict';
/** @function
  @name findOne - find one client or get info to his dashboard
  @memberof module:Client
  @desc Route - {@linkcode GET:/client/:id}
  @param {number} [id] - If param id doesn't exist, then userID will be taken from token
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
  let data = req.param("id");

  if(req.permission === 4) {
    data = req.token.userID;

    ValidService.valid({ id: data }, 'Client', true)
      .then(() => {
        ClientService.getDashboard(data)
          .then(res.ok)
          .catch(res.error);
      })
      .catch(res.error);
  } else {
    ValidService.valid({ id: data }, 'Client', true)
      .then(() => {
        ClientService.findOne(data)
          .then(res.ok)
          .catch(res.error);
      })
      .catch(res.error);
  }

};
