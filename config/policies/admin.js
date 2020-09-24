'use strict';
module.exports.policies = {
  'admin/findone': [ 'isLoggedIn', 'permissionModule', 'isAdmin' ]
};
