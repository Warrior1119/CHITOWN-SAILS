'use strict';
/** @module Announcement*/

/** @function
  @name create - Create announcement
  @memberof module:Announcement
  @desc Route - {@linkcode POST:/announcement}
  @param {String} title
  @param {Email} file - Max file zise is 16MB (16777216 Bytes)
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {
  if(req.permission === 2) return res.error({ errCode: 403, message: 'Access denied' });
  if(req.body.file && req.body.file.length >= 16777216) return res.error({ errCode: 400, message: 'File size must be less than 16MB' });

  Utilities.prepareData(req.body, req.permission, 'Announcement')
    .then(data => {
      ValidService.valid(data, 'Announcement')
        .then(() => AnnouncementService.create(data, req.token.userID))
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
