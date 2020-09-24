'use strict';
/** @module Download*/

/** @function
  @name download - only one file
  @memberof module:Download
  @desc Route - {@linkcode GET:/download/:contentType/:fileName}
  @param {String} contentType - invoice or diet
  @param {String} fileName
  @returns attachment - status 200 with file
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findOne (req, res) {
  const data = {
    contentType: req.param('contentType'),
    fileName: req.param('fileName'),
    userID: req.token.userID
  };

  if(data.fileName === undefined) return res.error(400);

  DownloadService.download(data)
    .then(_data => {
      if(_data.name) return res.download(_data.path, _data.name);

      return res.download(_data.path);
    })
    .catch(res.error);
};
