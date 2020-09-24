'use strict';

/** @function
  @name findOne - Find one product
  @memberof module:Product
  @desc Route - {@linkcode GET:/product/:id}
  @param {Number} id
  @returns OK - status 200 with object
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findOne (req, res) {
  const id = req.param('id');
  ValidService.isNumber([ id ])
    .then(() => {
      return ProductService.findOne(id, req.token.userID);
    })
    .then(res.ok)
    .catch(res.error);

};
