'use strict';
/** @function
  @name update - Update booking-types
  @memberof module:Booking_Type
  @desc Route - {@linkcode PUT:/booking-type/:id}
  @returns Status 200
  @returns [Server error]{@link Server_error}
*/
module.exports = function (req, res) {
  const id = req.param('id');
  if(isNaN(id)) return res.error({ errCode: 400, message: 'Id is not a number' });

  if(req.body.name && req.body.name >= 100) return res.error({ errCode: 400, message: 'Length of name should be less than 100 chars' });
  if(req.body.buildings && Utilities.isJSON(req.body.buildings)) req.body.buildings = JSON.parse(req.body.buildings);
  if(req.body.buildings && req.body.buildings.length === 0) return res.error({ errCode: 400, message: 'To create booking type, pls provide at least one building' });

  BookingTypeService.update(id, req.body)
    .then(res.ok)
    .catch(res.error);

};
