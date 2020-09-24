'use strict';

/** @function
  @name destroy - Destroy task
  @memberof module:Task
  @desc Route - {@linkcode DELETE:/task/:id}
  @param {String} id
  @returns noContent - status 204 without content
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  const id = req.param('id');

  if(Utilities.isNumeric(id)) {
    TaskService.destroy(id)
      .then(res.noContent)
      .catch(res.error);
  } else {
    return res.error(400);

  }
};
