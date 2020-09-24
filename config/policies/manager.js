'use strict';

module.exports.policies = {
  'manager/create': [ 'isLoggedIn', 'permissionModule', 'isAdmin' ],
  'manager/findone': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'manager/find': [ 'isLoggedIn', 'permissionModule', 'isAdmin' ],
  'manager/destroy': [ 'isLoggedIn', 'permissionModule', 'isAdmin' ],
  'manager/update': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
