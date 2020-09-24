'use strict';
function findClientFromUser (userID) {
  return new Promise((resolve, reject) =>  {
    User.findOne({ id: userID })
      .then(_user => {
        if(!_user) throw { errCode: 404, message: `User not found` };

        Client.findOne({ user: _user.email })
          .then(_client => {
            if(!_client) throw { errCode: 404, message: `Client not found` };

            return resolve(_client);
          })
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function populateTrainer (schedules) {
  return new Promise((resolve, reject) => {
    async.each(schedules, (schedule, next) => {
      if(schedule.trainingId.trainerId) {
        Trainer.findOne({ id: schedule.trainingId.trainerId })
        .then(_trainer => {
          if(!_trainer) throw { errCode: 404, message: `Trainer not found` };

          return User.findOne({ email: _trainer.user });
        })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: `Trainer user not found` };

          schedule.trainingId.trainerId = _user;
          next();
        })
        .catch(err => {
          sails.log.error(err);
          next();
        });
      } else {
        PropertyManager.findOne({ buildingId: schedule.trainingId.buildingId })
          .populateAll()
          .then(propManager => {
            if(!propManager) throw { errCode: 404, message: `Property manager not found` };
            schedule.trainingId.trainerId = propManager.user;
            next();
          })
          .catch(next);
      }
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(schedules);
    });
  });
}

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      Schedule.create({
        clientId: data.clientId,
        date: data.date,
        trainingId: data.trainingId
      })
        .meta({ fetch: true })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find (data) {
    return new Promise((resolve, reject) => {
      findClientFromUser(data.userID)
        .then(_client => {
          Schedule.find({
            where: {
              clientId: _client.id,
              date: { '>=': data.start, '<=': data.end }
            },
            sort: 'id DESC'
          })
            .populate('trainingId')
            .then(_schedules => {
              populateTrainer(_schedules)
                .then(resolve)
                .catch(reject);
            })
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
        .catch(reject);
    });
  },

  findOne (data) {
    return new Promise((resolve, reject) => {
      findClientFromUser(data.userID)
        .then(_client => {
          Schedule.findOne({
            id: data.id,
            clientId: _client.id
          })
            .populateAll()
            .then(_schedule => {
              if(!_schedule) return reject(404);
              return resolve(_schedule);
            })
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
        .catch(reject);
    });
  }
};
