'use strict';
/** @module Notification*/

/** @function
  @name create - Create notification
  @memberof module:Notification
  @desc Route - {@linkcode POST:/notification}
  @param {String} type - Avaible options: ['All', 'Building', 'User']
  @param {String} title
  @param {String} sentThrough - Avaible options: ['Email', 'Web', 'Email and Web']
  @param {Email} issuedTo - Optinal. Set if type === 'User'
  @param {Email} buildingId - Optinal. Set if type === 'Building'
  @param {Email} file - Optinal. Max file zise is 16MB (16777216 Bytes)
  @param {String} description
  @param {File} image
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/

module.exports = function create (req, res) {
  if(![ 'Email', 'Web', 'Email and Web' ].includes(req.body.sentThrough))
    return res.error({ errCode: 400, message: 'Only avaible types like "Email" or "Web" or "Email and Web". You sent: ' + req.body.sentThrough });

  if(!req.body.file || req.body.file === "" || req.body.file === "undefined") delete req.body.file;
  if(req.body.file && req.body.file.length >= 3145728) return res.error({ errCode: 400, message: 'File size must be less than 16MB' });

  Utilities.prepareData(req.body, req.permission, 'Notification')
    .then(data => {
      ValidService.valid(data, 'Notification')
        .then(() => {
          if(req.permission === 3) {
            if(![ 'Building', 'User' ].includes(req.body.type))
              return res.error({ errCode: 400, message: 'Only avaible types like "Building" or "User". You sent: ' + req.body.type });
            if(req.body.type === 'User' && !req.body.issuedTo)
              return res.errror({ errCode: 400, message: 'You need to provide to which user you want to send notification' });

            return NotificationService.createByPropertyManager(data, req.token.userID);
          } else if(req.permission <= 1) {
            if(![ 'Building', 'All' ].includes(req.body.type))
              return res.error({ errCode: 400, message: 'Only avaible types like "Building" or "User". You sent: ' + req.body.type });
            if(req.body.type === 'Building' && !req.body.buildingId)
              return res.errror({ errCode: 400, message: 'You need to provide to which building you want to send notification' });

            return NotificationService.create(data, req);
          } else {
            return res.error({ errCode: 404, message: 'Access denied' });
          }
        })
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
