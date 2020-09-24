'use strict';
module.exports.policies = {
  'building/create': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'building/find': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'building/findone': [ 'isLoggedIn', 'permissionModule' ],
  'building/update': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'building/destroy': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
