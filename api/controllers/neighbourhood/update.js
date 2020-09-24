'use strict';
/** @function
  @name update - Update neighbourhood
  @memberof module:Neighbourhood
  @desc Route - {@linkcode PUT:/neighbourhood/:id}
  @param {Number} [id] - Id of building. Required for Admin/Manager
  @param {Object} data - Data of building that we want to update
  @returns Ok - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  if (req.permission === 2 || req.permission === 4) return res.error({ errCode: 403, message: 'Access denied' });
  const data = req.body;
  data.id = req.param('id');

  if(data.link && data.link.length > 255) return res.error({ errCode: 400, message: 'Maximum length of link is 255 chars' });
  if(data.tag && data.tag.length > 7) return res.error({ errCode: 400, message: 'Maximum length of tag is 7 chars' });

  ValidService.valid(data, 'Neighbourhood', true)
    .then(() => {
      NeighbourhoodService.update(data, req)
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
