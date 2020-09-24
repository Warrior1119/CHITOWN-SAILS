'use strict';
/** @function
  @name destroy - Destroy manager
  @memberof module:Manager
  @desc Route - {@linkcode DEL:/manager/:id}
  @param {number} id - id of manager
  @returns No content - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  const data = req.param("id");

  ValidService.valid({ id: data }, 'Manager', true)
    .then(() => {
      UserService.destroy(data, 'Manager')
        .then(res.noContent)
        .catch(res.error);
    })
    .catch(res.error);
};
