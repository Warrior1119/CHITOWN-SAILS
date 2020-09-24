'use strict';
module.exports.policies = {
  'client/create': true,
  'client/createbymanager': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'client/createbypropertymanager': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'client/findprospect': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'client/find': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'client/destroy': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ]
};
