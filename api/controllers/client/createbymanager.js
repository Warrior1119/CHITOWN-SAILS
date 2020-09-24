'use strict';

/** @function
  @name createByManager - Create client through manager/admin panel
  @memberof module:Client
  @desc Route - {@linkcode POST:/manager/client}
  @param {String} firstName
  @param {String} lastName
  @param {String} email
  @param {Number} phone
  @param {Timestamp} birth
  @param {String} gender - Only 'Male' or 'Female'
  @param {String} street
  @param {String} apartment
  @param {String} zipCode
  @param {Number} trainerId - Only for Admin/Manager
  @param {File} [avatar] -
  @param {Boolean} [newsletter] - It would be better is you pass `false` or `true`
  @param {Boolean} [notification] - It would be better is you pass `false` or `true`
  @param {Number} [code] - Building code
  @returns Created - status 201 without content
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict}
  @returns [Not found]{@link Not_found} 'Can't found building with that code
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;

  data.role = 'Client';
  data.isActive = true;
  data.tag = 'Prospect';
  data.password = 'qwezxczasddasac123xsa';
  data.newsletter = Utilities.parseJsonToBool(data.newsletter);
  data.notification = Utilities.parseJsonToBool(data.notification);
  data.fromFacebook = false;


  ValidService.valid(data, 'Client')
    .then(() => {
      User.findOne({ email: data.email })
        .then(user => {
          if(user) return res.error({ errCode: 409, message: 'User with this email already exist' });

          BuildingService.findOneByCode(data.code)
            .then(building => {
              if(building) {
                data.buildingId = building.id;
                data.tag = 'Freemium';
              }
              data.avatar = req.file('avatar');
              UserService.create(data)
                .then(res.created)
                .catch(res.error);
            })
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
