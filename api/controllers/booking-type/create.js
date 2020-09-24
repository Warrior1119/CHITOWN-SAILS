'use strict';
/** @module Booking_Type*/

/** @function
  @name create - Create Booking type
  @memberof module:Booking_Type
  @desc Route - {@linkcode POST:/booking-type}
  @param {String} name
  @param {Array} buildings - Array of buildings ids
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {

  if(req.body.name >= 100) return res.error({ errCode: 400, message: 'Length of name should be less than 100 chars' });
  if(Utilities.isJSON(req.body.buildings)) req.body.buildings = JSON.parse(req.body.buildings);
  if(req.body.buildings.length === 0) return res.error({ errCode: 400, message: 'To create booking type, pls provide at least one building' });

  BookingTypeService.create(req.body)
    .then(res.created)
    .catch(res.error);
};
