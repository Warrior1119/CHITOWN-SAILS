'use strict';
/** @module Book */

/** @function
  @name create - Create Book
  @memberof module:Book
  @desc Route - {@linkcode POST:/book}
  @param {String} name - From Book Service Name
  @param {Number} price
  @param {Array} images
  @param {String} questions
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {

  Utilities.prepareData(req.body, req.permission, 'Book')
    .then(data => {
      ValidService.valid(data, 'Book')
        .then(() => BookService.create(data, req))
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);

};
