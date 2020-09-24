'use strict';
module.exports = function error (err) {
  const res = this.res;
  if(!_.isObject(err)) err = { errCode: err, message: '' };
  switch (err.errCode) {
    case 'stripe':
    /** @function
     * @name Stripe_error
     * @see https://stripe.com/docs/api/node#errors
     */
      sails.log.error(err.message);
      res.status(400);
      return res.jsonp({ errCode: 400, message: 'Some error occured with payment services' });
      break;
    case 400:
      /** @function
      * @name Bad_request
      * @returns status - 400
      * @returns data.errCode - 400
      * @returns data.message - Bad request
      */
      res.status(400);
      return res.jsonp({ errCode: 400, message: err.message || "Bad request" });
    case 401:
    /** @function
     * @name Unauthorized
     * @returns status - 401
     * @returns data.errCode - 401
     * @returns data.message - Unauthorized
     */
      res.status(401);
      return res.jsonp({ errCode: 401, message: err.message || "Unauthorized" });
    case 402:
    /** @function
     * @name Unauthorized
     * @returns status - 402
     * @returns data.errCode - 402
     * @returns data.message - Payment required
     */
      res.status(402);
      return res.jsonp({ errCode: 402, message: err.message || "Payment required" });
    case 403:
    /** @function
     * @name Forbidden
     * @returns status - 403
     * @returns data.errCode - 403
     * @returns data.message - Access denied
     */
      res.status(403);
      return res.jsonp({ errCode: 403, message: err.message || "Access denied", data: err.data });
    case 404:
    /** @function
     * @name Not_found
     * @returns status - 404
     * @returns data.errCode - 404
     * @returns data.message - Not found
     */
      res.status(404);
      return res.jsonp({ errCode: 404, message: err.message || "Not found" });
    case 409:
    /** @function
     * @name Conflict
     * @returns status - 409
     * @returns data.errCode - 409
     * @returns data.message - Bad request
     */
      res.status(409);
      return res.jsonp({ errCode: 409, message: err.message || "Object already exist" });
    default:
    /** @function
     * @name Server_error
     * @returns status - 500
     * @returns data.errCode - 500
     * @returns data.message - Server error
     */
      res.status(500);
      sails.log.error(err);
      return res.jsonp({ errCode: 500, message: "Server error" });
  }
};
