'use strict';
/** @function
  @name destroy - Destory Booking Type
  @memberof module:Booking_Type
  @desc Route - {@linkcode DEL:/booking-type/:id}
  @returns Status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function (req, res) {
  const id = req.param('id');
  if(isNaN(id)) return res.error({ errCode: 400, message: 'Id is not a number' });

  BookingTypeService.destroy(id)
    .then(res.ok)
    .catch(res.error);

};
