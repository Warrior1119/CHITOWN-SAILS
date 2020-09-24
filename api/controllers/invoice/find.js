'use strict';
/** @module Invoice*/

/** @function
  @name find - Find all client invoices
  @memberof module:Invoice
  @desc Route - {@linkcode GET:/invoice}
  @returns Ok - status 200 with array
  @returns [Not found]{@link Not_found} User not found.
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  InvoiceService.find(req.token.userID)
    .then(res.ok)
    .catch(res.error);
};
