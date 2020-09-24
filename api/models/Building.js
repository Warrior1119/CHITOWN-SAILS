'use strict';

module.exports = {
  attributes: {
    address: { type: 'string', required: true },
    name: { type: 'string', required: true },
    logo: { type: 'string', defaultsTo: 'building_logo.png' },
    image: { type: 'string', defaultsTo: 'building_image.png' },
    phone: { type: 'number', required: true },
    postalCode: { columnName: 'postal_code', type: 'number', required: true },
    code: { type: 'number', required: true },
    active: { type: 'boolean', defaultsTo: true },
    link: { type: 'string', required: false, allowNull: true },
    buildingFaqLink: { type: 'string', required: false, allowNull: true },
    amenitiesInfoLink: { type: 'string', required: false, allowNull: true },
    payRentLink: { type: 'string', required: false, allowNull: true },
    onlineFeedbackLink: { type: 'string', required: false, allowNull: true },
    referFriendsLink: { type: 'string', required: false, allowNull: true },
    neighborhoodPerksDiscountsLink: { type: 'string', required: false, allowNull: true },
    rewardsLink: { type: 'string', required: false, allowNull: true },
    onSiteServicesLink: { type: 'string', required: false, allowNull: true },
    facebookLink: { type: 'string', required: false, allowNull: true },
    twitterLink: { type: 'string', required: false, allowNull: true },
    communityGuidelinesLink: { type: 'string', required: false, allowNull: true },
    feedbackToManagementLink: { type: 'string', required: false, allowNull: true },
    residentGuideLink: { type: 'string', required: false, allowNull: true },
    moveInChecklistLink: { type: 'string', required: false, allowNull: true },
    importantNumbersLink: { type: 'string', required: false, allowNull: true },
    lyftDiscountLink: { type: 'string', required: false, allowNull: true },
    uberDiscountLink: { type: 'string', required: false, allowNull: true },
    grubhubDiscountLink: { type: 'string', required: false, allowNull: true },
    amenityReservationLink: { type: 'string', required: false, allowNull: true },
    amenityReservationEmail: { type: 'string', required: false, allowNull: true },
    rentersInsuranceLink: { type: 'string', required: false, allowNull: true },
    bikeShareLink: { type: 'string', required: false, allowNull: true },
    leaseRenewalLink: { type: 'string', required: false, allowNull: true }
  }
};
