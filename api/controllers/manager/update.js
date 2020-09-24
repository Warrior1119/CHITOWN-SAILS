'use strict';
/** @function
  @name update - Update manager
  @memberof module:Manager
  @desc Route - {@linkcode PUT:/manager/:id} OR {@linkcode PUT:/manager}
  @param {Number} id - id of manager
  @param {Object} data - data of manager that we want to update
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  data.id = req.param("id");

  if(req.permission === 1) {
    data.id = req.token.userID;

    ValidService.valid(data, 'Manager', true)
      .then(() => {
        UserService.update(data, 'Manager', req)
          .then(res.ok)
          .catch(res.error);
      })
      .catch(res.error);
  } else {
    ValidService.valid(data, 'Manager', true)
      .then(() => {
        UserService.update(data, 'Manager', req)
          .then(res.ok)
          .catch(res.error);
      })
      .catch(res.error);
  }

};
