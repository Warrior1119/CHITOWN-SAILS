'use strict';

module.exports.policies = {
  'notification/create': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
};
