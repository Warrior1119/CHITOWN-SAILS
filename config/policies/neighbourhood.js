'use strict';
module.exports.policies = {
  'neighbourhood/create': [ 'isLoggedIn', 'permissionModule'],
  'neighbourhood/find': [ 'isLoggedIn', 'permissionModule'],
  'neighbourhood/findone': [ 'isLoggedIn', 'permissionModule' ],
  'neighbourhood/update': [ 'isLoggedIn', 'permissionModule'],
  'neighbourhood/destroy': [ 'isLoggedIn', 'permissionModule']
};
