'use strict';
module.exports.policies = {
  'training/findforbuilding': true,
  'training/create': [ 'isLoggedIn', 'permissionModule', 'isTrainer' ],
  'training/findclienthistory': [ 'isLoggedIn', 'permissionModule', 'isManager' ],
  'training/createbypropertymanager': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'training/notifyparticipants': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'training/updatebypropertymanager': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'training/destroy': [ 'isLoggedIn', 'permissionModule', 'isPropertyManager' ],
  'training/checkin': [ 'isLoggedIn', 'permissionModule', 'isTrainer' ],
};
