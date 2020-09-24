module.exports.policies = {
  'sku/*': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
