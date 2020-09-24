module.exports.policies = {
  'shop/create': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'shop/update': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'shop/destroy': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
