'use strict';
/** @module Maintainance*/

/** @function
  @name create - Create Maintainance
  @memberof module:Maintainance
  @desc Route - {@linkcode POST:/maintainance}
  @param {String} type - Avaible options: ['Default']
  @param {String} description
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {
  if(req.body.description >= 16777216) return res.error({ errCode: 403, message: 'Description too large' });
  if(req.body.type !== 'Default') return res.error({ errCode: 403, message: 'Only avaible options are: Default' });

  Utilities.prepareData(req.body, req.permission, 'Maintainance')
    .then(data => {
      ValidService.valid(data, 'Maintainance')
        .then(() => MaintainanceService.create(data, req.token.userID))
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
