'use strict';
/** @function
  @name update - Update book service
  @memberof module:Book
  @desc Route - {@linkcode PUT:/book/:id}
  @param {Number} [id] - Id of book. Required for Admin/Manager
  @param {Object} data - Data of book that we want to update
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  data.id = req.param('id');

  ValidService.valid(data, 'Book', true)
    .then(() => {
      BookService.update(data.id, data)
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
