'use strict';
/** @function
  @name find - Find all book services
  @memberof module:Book
  @desc Route - {@linkcode GET:/book}
  @returns Find - status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  BookService.find()
    .then(res.ok)
    .catch(res.error);
};
