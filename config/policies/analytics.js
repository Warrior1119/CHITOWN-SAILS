'use strict';

module.exports.policies = {
  'analytics/*': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
