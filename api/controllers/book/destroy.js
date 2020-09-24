'use strict';
/** @function
  @name destroy - Destroy book service
  @memberof module:Book
  @desc Route - {@linkcode DEL:/book/:id}
  @param {number} id - id of book
  @returns No content - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  const id = req.param('id');

  if(isNaN(id)) return res.error({ errCode: 400, message: 'Id should be number' });

  BookService.destroy(id)
    .then(res.noContent)
    .catch(res.error);
};
