'use strict';

module.exports.policies = {
  'booking-type/create': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'booking-type/destroy': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'booking-type/update': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
};
