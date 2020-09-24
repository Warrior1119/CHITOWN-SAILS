'use strict';
/** @function
  @name findOne - find one Property manager or get dashboard
  @memberof module:PropertyManager
  @desc Route - {@linkcode GET:/propertyManager/:id}
  @param {Number} [id] - If id doesn't exist then userID will be taken from token
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
  if(req.permission === 2) return res.error(403);
  let data = req.param("id");

  if(req.permission === 3) {
    data = req.token.userID;

    ValidService.valid({ id: data }, 'PropertyManager', true)
      .then(() => {
        PropertyManagerService.getDashboard(data)
          .then(res.ok)
          .catch(res.error);
      })
      .catch(res.error);
  } else {
    ValidService.valid({ id: data }, 'PropertyManager', true)
      .then(() => {
        PropertyManagerService.findOne(data)
          .then(res.ok)
          .catch(res.error);
      })
      .catch(res.error);
  }
};
