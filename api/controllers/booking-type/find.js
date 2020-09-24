'use strict';
/** @function
  @name find - Find Booking type
  @memberof module:Booking_Type
  @desc Route - {@linkcode GET:/booking-type/:page} or  {@linkcode GET:/booking-type} for client
  @param {Number} [page] - Only for Manager/Admin. Number of page
  @returns Find - status 200 with content
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const page = req.param('page');

  if(req.permission === 4) {
    BookingTypeService.findByClient(req.token.userID)
      .then(res.ok)
      .catch(res.error);
  } else if (req.permission <= 1) {
    if(isNaN(page)) return res.error({ errCode: 400, message: 'Page is not a number' });

    BookingTypeService.find(page)
      .then(res.ok)
      .catch(res.error);
  } else {
    return res.error({ errCode: 403, message: 'Access denied' });
  }
};
