'use strict';
/** @module Neighbourhood*/

/** @function
@name create - Create neighbourhood
@memberof module:Neighbourhood
@desc Route - {@linkcode POST:/Neighbourhood}
@param {String} name
@param {Number} buildingId - Optinal. Set if type === 'Building'
@param {String} tag
@param {File} [logo]
@param {File} [image]
@param {String} description
@param {String} category
@param {String} link

*/
module.exports = function create (req, res) {
  const data = req.body;
  if (req.permission === 2 || req.permission === 4) return res.error({ errCode: 403, message: 'Access denied' });
  else if(data.tag && data.tag.length > 7) return res.error({ errCode: 400, message: 'Maximum length of tag is 7 chars' });
  else if (!data.category ||
            data.category !== 'Restaurants and Bars' &&
            data.category !== 'Nightlife' &&
            data.category !== 'Services' &&
            data.category !== 'Fitness Studios' &&
            data.category !== 'Gym Memberships' &&
            data.category !== 'Beauty & Spa' &&
            data.category !== 'Arts & Entertainment' &&
            data.category !== 'Pet Services' &&
            data.category !== 'Hotels' &&
            data.category !== 'Transportation Services') return res.error ({errCode: 404, message: 'Category option does not exist' });
  else {
    Utilities.prepareData(data, req.permission, 'Neighbourhood')
      .then(data => {
        ValidService.valid(data, 'Neighbourhood')
        .then(() => {
          NeighbourhoodService.create(data, req)
          .then(res.created)
          .catch(res.error);
        })
        .catch(res.error);
      })
      .catch(res.error);
  }
};
