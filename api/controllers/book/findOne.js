'use strict';
/** @function
  @name findOne - find one book service
  @memberof module:Book
  @desc Route - {@linkcode GET:/book/:id}
  @param {number} [id]- Id of book. Required for Admin/Manager
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
    const id = req.param('id');
    if(isNaN(id)) return res.error({ errCode: 400, message: 'Id should be number' });
    BookService.findOne(id)
      .then(res.ok)
      .catch(res.error);
};
