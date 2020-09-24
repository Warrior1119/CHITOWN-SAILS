'use strict';

module.exports.policies = {
  'diet/create': [ 'isLoggedIn', 'permissionModule', 'isTrainer' ],
  'diet/add-diet': [ 'isLoggedIn', 'permissionModule', 'isManager' ]
};
