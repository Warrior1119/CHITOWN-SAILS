'use strict';
/** @module Booking */

/** @function
  @name create - Create Booking
  @memberof module:Booking
  @desc Route - {@linkcode POST:/booking}
  @param {Number} typeId - From Booking Type
  @param {Timestamp} date
  @param {String} message - Max 255 chars
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {
  if(!req.body.message || req.body.message.length > 255) return res.error({ errCode: 400, message: 'Message length can not be more than 255 chars' });

  Utilities.prepareData(req.body, req.permission, 'Booking')
    .then(data => {
      ValidService.valid(data, 'Booking')
        .then(() => BookingService.create(data, req.token.userID))
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);

};
