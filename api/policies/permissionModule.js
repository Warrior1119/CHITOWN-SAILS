'use strict';

function checkClient (email) {
  return new Promise((resolve, reject) => {
    Client.findOne({ user: email, active: true })
      .then(_client => {
        if(!_client) throw { errCode: 403, message: 'User blocked by app Administrator', data: { isBlocked: true } };
        if(_client.deleted) throw { errCode: 404, message: 'User not found' };
        return resolve();
      })
      .catch(reject);
  });
}

function checkTrainer (email) {
  return new Promise((resolve, reject) => {
    Trainer.findOne({ user: email, active: true })
      .then(_trainer => {
        if(!_trainer) throw { errCode: 403, message: 'User blocked by app Administrator', data: { isBlocked: true } };
        return resolve();
      })
      .catch(reject);
  });
}

module.exports = function permissionModule (req, res, next) {
  const userID = req.token.userID;

  User.findOne({ id: userID })
    .then(_user => {
      if(!_user) throw { errCode: 404, message: 'User not found' };
      if(!_user.isActive) throw { errCode: 403, message: 'User not activated' };
      switch (_user.role) {
        case 'Client':
          req.permission = 4;
          req.role = 'Client';
          checkClient(_user.email)
            .then(() => next())
            .catch(res.error);
          break;
        case 'PropertyManager':
          req.permission = 3;
          req.role = 'PropertyManager';
          return next();
          break;
        case 'Trainer':
          req.permission = 2;
          req.role = 'Trainer';
          checkTrainer(_user.email)
            .then(() => next())
            .catch(res.error);
          break;
        case 'Manager':
          req.permission = 1;
          req.role = 'Manager';
          return next();
          break;
        case 'Administrator':
          req.permission = 0;
          req.role = 'Administrator';
          return next();
          break;
        default:
          return res.error();
      }
    })
    .catch(err => {
      return res.error(err);
    });
};
