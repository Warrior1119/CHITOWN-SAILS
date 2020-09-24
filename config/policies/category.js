'use strict';

module.exports.policies = {
  'task-category/find': [ 'isLoggedIn', 'permissionModule', 'isTrainer' ]
};
//TODO:  PM
