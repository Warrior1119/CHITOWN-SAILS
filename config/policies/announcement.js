'use strict';

module.exports.policies = {
  'announcement/create': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'announcement/destroy': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'announcement/update': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ]
};
