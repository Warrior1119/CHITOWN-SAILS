'use strict';
/** @module Product*/

/** @function
  @name find - Find products
  @memberof module:Product
  @desc Route for Client - {@linkcode GET:/product}<br />
  Route for Manager/Admin - {@linkcode GET:/product/client/:id}
  @param {Number} id - Client ID
  @returns Ok - status 200 with array. If Client doesn't bought any product the response will be empty array
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} User not found or user is not a clinet.
  @returns [Server error]{@link Server_error}
*/

module.exports = function find (req, res) {
  if(req.permission === 4) {
    ProductService.find(req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else if(req.permission === 2) {
    if(isNaN(req.param('id'))) return res.error(400);

    ProductService.findByTrainer(req.token.userID, req.param('id'))
      .then(res.ok)
      .catch(res.error);
  } else if(req.permission <= 1) {
    if(isNaN(req.param('id'))) return res.error(400);

    ProductService.findByManager(req.param('id'))
      .then(res.ok)
      .catch(res.error);
  } else {
    return res.error(403);
  }
};
