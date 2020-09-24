'use strict';

function sumAttendanceByDay (data) {
  data = _.groupBy(data, x => Utilities.getStartOfDay(x.date));
  for (const day in data) data[day] = data[day].length;

  return data;
}

function getClientName (email, info) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then(_client => {
        info.clientName = `${_client.firstName} ${_client.lastName}`;
        return resolve(info);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function getClientServiceOrder (data, info) {
  return new Promise((resolve, reject) => {
    Order.find({ where: { name: data.type, clientId: data.id }, sort: 'id DESC' }).limit(1)
      .then(_order => {
        info.servicePrice = _order[0] ? _order[0].spent : null;
        info.purchaseDate = _order[0] ? _order[0].createdAt : null;

        return resolve(info);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function getPropertyManager (buildingId) {
  return new Promise((resolve, reject) => {
    PropertyManager.findOne({ buildingId: buildingId })
      .populateAll()
      .then(resolve)
      .catch(reject);
  });
}

function getLastVisitInfo (data, info) {
  return new Promise((resolve, reject) => {
    Schedule.find({
      where: { clientId: data.id, date: { '<=': new Date().getTime() } },
      sort: 'id DESC'
    })
      .populate('trainingId')
      .limit(1)
      .then(_last => {
        if(_last[0]) {
          info.lastVisit = _last[0].date;

          if(_last[0].trainingId.trainerId) {
            Trainer.findOne({ id: _last[0].trainingId.trainerId }).populate('user')
              .then(_lastTrainer => {
                if(_lastTrainer) {
                  info.lastTrainer = `${_lastTrainer.user.firstName} ${_lastTrainer.user.lastName}`;
                }

                return resolve(info);
              })
              .catch(reject);
          } else if(_last[0].buildingId) {
            getPropertyManager(_last[0].buildingId)
              .then(_lastTrainer => {
                if(!_lastTrainer) info.lastTrainer = "Noone";

                info.lastTrainer = `${_lastTrainer.user.firstName} ${_lastTrainer.user.lastName}`;
              })
              .catch(reject);
          } else {
            throw { errCode: 500, message: 'Training does not have trainer and building' };
          }

        } else {
          info.lastVisit = null;
          info.lastTrainer = null;

          return resolve(info);
        }
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function getNextVisitInfo (data, info) {
  return new Promise((resolve, reject) => {
    Schedule.find({
      where: { clientId: data.id, date: { '>=': new Date().getTime() } },
      sort: 'id DESC'
    })
      .limit(1)
      .then(_next => {
        info.nextVisit = _next[0] ? _next[0].date : null;

        return resolve(info);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function getRemainingVisits (data, info) {
  // TODO: Add product duration file. I may be possible it will be few product with same name but diffrent duration
  return new Promise((resolve, reject) => {
    Product.findOne({ clientId: data.id, name: data.type })
      .then(_clientProduct => {

        info.expirationDate = _clientProduct ? _clientProduct.expDate : null;
        info.visitsRemaining = _clientProduct ? _clientProduct.quantity : null;

        return resolve(info);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function getTrainerName (data, info) {
  return new Promise((resolve, reject) => {
    Trainer.findOne({ id: data.id })
      .populate('user')
      .then(_trainer => {
        info.trainer = _trainer ? `${_trainer.user.firstName} ${_trainer.user.lastName}` : null;

        return resolve(info);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function getPropertyManagerName (buildingId, info) {
  return new Promise((resolve, reject) => {
    PropertyManager.findOne({ buildingId: buildingId })
      .populateAll()
      .then(_propertyManager => {
        info.trainer = _propertyManager ? `${_propertyManager.user.firstName} ${_propertyManager.user.lastName}` : null;

        return resolve(info);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function buildTableForRemainng (data) {
  return new Promise((resolve, reject) => {
    const preparedTable = [];

    async.eachSeries(data, (prop, next) => {
      const info = {};

      getClientName(prop.clientId.user, info)
        .then(info => {
          if(_.some(preparedTable, { clientName: info.clientName, serviceName: prop.trainingId.type })) {
            return next();
          } else {
            getClientServiceOrder({ type: prop.trainingId.type, id: prop.clientId.id }, info)
              .then(info => {
                return getLastVisitInfo({ id: prop.clientId.id }, info);
              })
              .then(info => {
                return getNextVisitInfo({ id: prop.clientId.id }, info);
              })
              .then(info => {
                return getRemainingVisits({ id: prop.clientId.id, type: prop.trainingId.type }, info);
              })
              .then(info => {
                info.serviceName = prop.trainingId.type;
                preparedTable.push(info);
                return next();
              })
              .catch(reject);
          }
        })
        .catch(reject);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(preparedTable);
    });
  });
}

function buildTableForAttending (data) {
  return new Promise((resolve, reject) => {
    const preparedTable = [];

    async.eachSeries(data, (prop, next) => {
      const info = {};

      getClientName(prop.clientId.user, info)
        .then(info => {
          if(!prop.trainingId.trainerId) return getPropertyManagerName(prop.trainingId.buildingId, info);
          return getTrainerName({ id: prop.trainingId.trainerId }, info);
        })
        .then(info => {
          info.serviceName = prop.trainingId.type;
          info.time = prop.trainingId.duration;
          preparedTable.push(info);
          return next();
        })
        .catch(reject);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(preparedTable);
    });
  });
}

module.exports = {
  analyze (data) {
    return new Promise((resolve, reject) => {
      const criteria = {
        where: {
          clientId: data.clientId,
          participation: true
        },
        sort: 'id ASC'
      };

      criteria.where = Utilities.cleanProps(criteria.where);
      criteria.where.date = { '>=': data.start, '<=': data.end };

      Schedule.find(criteria)
        .populateAll()
        .then(_orders => {
          if(data.reportType === 'attendance') {
            let grpah = null;
            buildTableForAttending(_orders)
              .then(_table => {
                grpah = sumAttendanceByDay(_orders);
                return resolve({ grpah: grpah, table: _table });
              })
              .catch(reject);
          } else {
            buildTableForRemainng(_orders)
              .then(_table => {
                return resolve({ table: _table });
              })
              .catch(reject);
          }
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
