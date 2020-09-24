'use strict';
/** @module Diet*/

/** @function
  @name upload - Upload diet for client
  @memberof module:Diet
  @desc Route - {@linkcode POST:/diet}
  @param {String} hash
  @param {File} diet
  @returns noContent - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} Diet with this hash was not found
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;
  if(!data.hash) return res.error(400);
  data.diet = req.file('diet');

  DietService.upload(data)
    .then(res.ok)
    .catch(res.error);
};
