'use strict';
module.exports.policies = {
  'book/create': [ 'isLoggedIn', 'permissionModule'],
  'book/find': [ 'isLoggedIn', 'permissionModule'],
  'book/findone': [ 'isLoggedIn', 'permissionModule'],
  'book/update': [ 'isLoggedIn', 'permissionModule'],
  'book/destroy': [ 'isLoggedIn', 'permissionModule']
};
