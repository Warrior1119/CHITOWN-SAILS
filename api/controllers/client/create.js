'use strict';
/** @module Client*/

/** @function
  @name create - Create client
  @memberof module:Client
  @desc Route - {@linkcode POST:/client}
  @param {String} firstName
  @param {String} lastName
  @param {String} email
  @param {String} password
  @param {Number} phone
  @param {Number} birth - Timestamp eg. Date.now()
  @param {String} gender - Only 'Male' or 'Female'
  @param {String} street
  @param {String} apartment
  @param {String} zipCode
  @param {Number} trainerId - Only for manager
  @param {File} [avatar]
  @param {Boolean} [newsletter] - It would be better is you pass `false` or `true`
  @param {Boolean} [notification] - It would be better is you pass `false` or `true`
  @param {Boolean} [fromFacebook] - It would be better is you pass `false` or `true`
  @param {Number} [code] - Building code
  @returns Created - status 201 without content
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict}
  @returns [Not found]{@link Not_found} 'Can't found building with that code
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;

  Utilities.prepareData(data, req.permission, 'Client')
    .then(data => {
      data.role = 'Client';
      data.isActive = false;
      data.tag = 'Prospect';

      delete data.trainerId;

      data.newsletter = Utilities.parseJsonToBool(data.newsletter);
      data.notification = Utilities.parseJsonToBool(data.notification);
      data.fromFacebook = Utilities.parseJsonToBool(data.fromFacebook);

      User.findOne({ email: data.email })
        .then(user => {
          if(user) return res.error({ errCode: 409, message: 'User with this email already exist' });
          else {
            ValidService.valid(data, 'Client')
              .then(() => {
                BuildingService.findOneByCode(data.code)
                  .then(building => {
                    if(building) {
                      data.buildingId = building.id;
                      data.tag = 'Freemium';
                      if (!data.street) data.street = building.address;
                    }

                    data.avatar = req.file('avatar');
                    UserService.create(data, req)
                      .then(res.created)
                      .catch(res.error);
                  })
                  .catch(res.error);
              })
              .catch(res.error);
          }
        })
        .catch(res.error);
    })
    .catch(res.error);
};
