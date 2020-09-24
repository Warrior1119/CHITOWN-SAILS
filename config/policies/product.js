'use strict';
module.exports.policies = {
  'product/add-session': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
