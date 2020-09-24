'use strict';
/** @module Trainer*/

/** @function
  @name create - Create trainer
  @memberof module:Trainer
  @desc Route - {@linkcode POST:/trainer}
  @param {String} firstName
  @param {String} lastName
  @param {String} email
  @param {String} gender - Male or Female
  @param {Number} phone
  @param {String} [street]
  @param {String} [apartment]
  @param {String} [zipCode]
  @param {Array} [services] - Array of objects. Example: [{serviceId: 1, fee: 300, percentage: false}, {serviceId: 2, fee: 30, percentage: true}]
  @param {File} [avatar]
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict}
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;
  data.role = 'Trainer';
  if(Utilities.isJSON(data.services)) data.services = JSON.parse(data.services);

  User.findOne({ email: data.email })
    .then(user => {
      if(user) return res.error({ errCode: 409, message: 'User with this email already exist' });

      data.avatar = req.file('avatar');
      ValidService.valid(data, 'Trainer')
        .then(() => {
          UserService.create(data, req)
            .then(res.created)
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
