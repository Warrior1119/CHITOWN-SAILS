'use strict';
/** @module Building*/

/** @function
  @name create - Create building
  @memberof module:Building
  @desc Route - {@linkcode POST:/building}
  @param {string} address
  @param {string} name
  @param {number} code
  @param {number} phone
  @param {number} postalCode
  @param {boolean} [active]
  @param {file} [logo]
  @param {file} [image]
  @param {string} link
  @param {string} category
  @param {string} [buildingFaqLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [amenitiesInfoLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [payRentLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [onlineFeedbackLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [referFriendsLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [neighborhoodPerksDiscountsLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [rewardsLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [onSiteServicesLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [facebookLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [twitterLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [communityGuidelinesLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [feedbackToManagementLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [residentGuideLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [moveInChecklistLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [importantNumbersLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [lyftDiscountLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [uberDiscountLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [grubhubDiscountLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [amenityReservationLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [amenityReservationEmail] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [rentersInsuranceLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [bikeShareLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @param {string} [leaseRenewalLink] - RegEx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]{3,255}$/
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Conflict]{@link Conflict} Building with that same `code` already exist
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;
  Utilities.prepareData(data, req.permission, 'Building')
    .then(data => {
      ValidService.valid(data, 'Building')
        .then(() => {
          BuildingService.create(data, req)
            .then(res.created)
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
