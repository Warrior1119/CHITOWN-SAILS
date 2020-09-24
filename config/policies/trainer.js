module.exports.policies = {
  'trainer/create': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'trainer/findone': [ 'isLoggedIn', 'permissionModule', 'isTrainer' ],
  'trainer/find': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'trainer/update': [ 'isLoggedIn', 'permissionModule', 'isTrainer' ]
};
