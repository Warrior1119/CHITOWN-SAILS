module.exports.policies = {
  'task/create': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'task/destroy': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'task/update': [ 'isLoggedIn', 'permissionModule', 'isTrainer' ],
  'task/find': [ 'isLoggedIn', 'permissionModule', 'isTrainer' ]
};
// TODO: PM
