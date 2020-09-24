'use strict';

module.exports = {
  building: {
    address: {
      type: 'string',
      required: true,
      permission: 3
    },

    name: {
      type: 'string',
      required: true,
      permission: 3
    },

    phone: {
      type: 'number',
      required: true,
      permission: 3
    },

    postalCode: {
      type: 'number',
      required: true,
      permission: 3
    },

    code: {
      type: 'number',
      required: true,
      permission: 3
    },

    active: {
      type: 'boolean',
      required: false,
      permission: 1
    },

    link: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    category: {
      type: 'string',
      required: true,
      permission: 3,
    },

    buildingFaqLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    amenitiesInfoLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    payRentLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    onlineFeedbackLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    referFriendsLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    neighborhoodPerksDiscountsLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    rewardsLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    onSiteServicesLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    facebookLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    twitterLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    communityGuidelinesLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    feedbackToManagementLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    residentGuideLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    moveInChecklistLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    importantNumbersLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    lyftDiscountLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    uberDiscountLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    grubhubDiscountLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    amenityReservationLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    amenityReservationEmail: {
      type: 'email',
      required: false,
      permission: 3
    },

    rentersInsuranceLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    bikeShareLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    },

    leaseRenewalLink: {
      type: 'string',
      required: false,
      permission: 3,
      pattern: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    }

  }
};
