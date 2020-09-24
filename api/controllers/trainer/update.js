'use strict';
/** @function
  @name update - Update trainer
  @memberof module:Trainer
  @desc Route - {@linkcode PUT:/trainer/:id}
  @param {Number} id - Only for manager and Admin.
  @param {Object} data - If u need update services, you must send me all services which trainer should have
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not Found]{@link Not_found} User/Trainer doesn't exist
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  if(Utilities.isJSON(data.services)) data.services = JSON.parse(data.services);
  if(req.permission === 2) data.id = req.token.userID;
  else data.id = req.param("id");

  Utilities.prepareData(data, req.permission, 'Trainer')
    .then(data => {
      ValidService.valid(data, 'Trainer', true)
        .then(() => {
          UserService.update(data, 'Trainer', req)
            .then(res.ok)
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
