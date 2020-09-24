'use strict';
/** @module Session*/

/** @function
  @name create - Create user session / Login user
  @memberof module:Session
  @desc Route - {@linkcode POST:/session}
  @param {String} email - User email
  @param {String} password - User password
  @returns Created - status 201 without data
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Unauthorized]{@link Unauthorized}
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;
  ValidService.valid(data, 'RedisSession')
    .then(() => {
      SessionService.create(data)
        .then(token => {
          return res.created(token);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
