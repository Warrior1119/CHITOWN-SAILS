'use strict';
module.exports.policies = {
  'promo-code/create': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'promo-code/destroy': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
