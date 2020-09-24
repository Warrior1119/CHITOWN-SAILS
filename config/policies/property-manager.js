'use strict';

module.exports.policies = {
  'property-manager/create': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'property-manager/findone': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'property-manager/find': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'property-manager/update': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ]
};
