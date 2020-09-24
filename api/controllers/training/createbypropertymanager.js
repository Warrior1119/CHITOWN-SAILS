'use strict';
/** @function
  @name createByPropertyManager - Create event by Property manager
  @memberof module:Training
  @desc Route - {@linkcode POST:/propertyManager/training}
  @param {String} name
  @param {String} [description]
  @param {Timestamp} date
  @param {Number} duration - In minutes
  @param {Number} cost - In $$$. if training is Free, send 0
  @param {Boolean} canceled
  @param {Number} capacity
  @param {String} [file] - Should be in base64 encoded. Max 16 MB (16777216 B)
  @param {file} image
  @param {String} [place]
  @returns Created - status 201a
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;
  data.userID = req.token.userID;

  if(!data.file || data.file === "" || data.file === "undefined") delete data.file;
  if(data.file && data.file.length >= 16777216) return res.error({ errCode: 400, message: 'File size must be less than 16MB' });

  Utilities.prepareData(data, 3, 'PropertyManagerTraining')
    .then(data => {
      ValidService.valid(data, 'PropertyManagerTraining')
        .then(() => TrainingService.createByPropertyManager(data, req))
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
