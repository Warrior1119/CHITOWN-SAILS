'use strict';
/** @function
  @name update - Update client
  @memberof module:Client
  @desc Route - {@linkcode PUT:/client/:id}
  @param {Number} [id] - Req only if req not belong to client
  @param {Object} data - data of client that we want to update
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  data.id = req.param("id");

  if(req.permission === 2) return res.error(403);

  Utilities.prepareData(data, req.permission, 'Client')
    .then(data => {
      ValidService.valid(data, 'Client', true)
        .then(() => {
          if(req.permission === 4) {
            data.id = req.token.userID;

            ClientService.updateByClient(data, 'Client', req)
              .then(res.ok)
              .catch(res.error);
          } else {
            UserService.update(data, 'Client', req)
              .then(res.ok)
              .catch(res.error);
          }
        })
        .catch(res.error);
    })
    .catch(res.error);
};
