'use strict';
/** @module PropertyManager*/

/** @function
  @name create - Create Property manager
  @memberof module:PropertyManager
  @desc Route - {@linkcode POST:/propertyManager}
  @param {String} firstName
  @param {String} lastName
  @param {String} email
  @param {String} gender - Male or Female
  @param {Number} buildingId
  @param {File} [avatar]
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict} User exist or Property manager for this building exist
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {
  const data = req.body;
  data.role = 'PropertyManager';
  data.avatar = req.file('avatar');

  ValidService.valid(data, 'PropertyManager')
    .then(() => {
      UserService.create(data)
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
