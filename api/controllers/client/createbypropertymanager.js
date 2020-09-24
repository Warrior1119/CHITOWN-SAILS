'use strict';

/** @function
  @name createByPropertyManager - Create client through property manager panel
  @memberof module:Client
  @desc Route - {@linkcode POST:/propertyManager/client}
  @param {String} firstName
  @param {String} lastName
  @param {String} email
  @param {Number} phone
  @param {Timestamp} birth
  @param {String} gender - Only 'Male' or 'Female'
  @param {String} street
  @param {String} apartment
  @param {String} zipCode
  @param {File} [avatar]
  @param {Boolean} [newsletter]
  @param {Boolean} [notification]
  @returns Created - status 201 without content
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;

  data.userID = req.token.userID;
  data.newsletter = Utilities.parseJsonToBool(data.newsletter);
  data.notification = Utilities.parseJsonToBool(data.notification);

  Utilities.prepareData(data, req.permission, 'Client-property-manager')
    .then(data => {
      ValidService.valid(data, 'Client-property-manager')
        .then(() => {
          User.findOne({ email: data.email })
            .then(user => {
              if(user) return res.error({ errCode: 409, message: 'User with this email already exist' });

              data.avatar = req.file('avatar');
              return UserService.createClientByPropertyManager(data);
            })
            .then(res.created)
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
