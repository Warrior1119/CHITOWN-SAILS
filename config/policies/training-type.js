'use strict';

module.exports.policies = {
  'training-type/find': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
