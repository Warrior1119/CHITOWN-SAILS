'use strict';
/** @function
  @name update - Update Property manager
  @memberof module:PropertyManager
  @desc Route - {@linkcode PUT:/propertyManager/:id}
  @param {Number} [id] - If id doesn't exist then id will be taken from token
  @param {Object} data
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not Found]{@link Not_found} User/Property manager doesn't exist
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  if(req.permission === 2) return res.error(403);

  const data = req.body;

  if(req.permission === 3) data.id = req.token.userID;
  else data.id = req.param("id");

  Utilities.prepareData(data, req.permission, 'PropertyManager')
    .then(data => {
      ValidService.valid(data, 'PropertyManager', true)
        .then(() => {
          UserService.update(data, 'PropertyManager', req)
            .then(res.ok)
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
