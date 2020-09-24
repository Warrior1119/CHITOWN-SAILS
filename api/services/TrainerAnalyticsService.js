'use strict';

function payrollParseGroup (group) {
  return new Promise((resolve, reject) => {
    const data = [];

    TrainingType.findOne({ name: group[0].type.name }) // get service ID
      .then(_item => {
        if(!_item) return reject(404);

        return ServiceTrainer.findOne({ trainerId: group[0].trainerId.id, serviceId: _item.name }); //get service trainer info
      })
      .then(_service => {
        if(!_service) return reject(404);

        async.eachSeries(group, (training , next) => {
          const chunk = {
            date: training.date,
            duration: training.duration,
            clientName: 0,
            clients: training.clients.length,
            fee: _service.percentage ? training.cost * (_service.fee / 100) : _service.fee
          };

          if(!training.mainClient) {
            data.push(chunk);
            next();
          } else {
            User.findOne({ email: training.mainClient.user }) // get name of client
              .then(_user => {
                if(!_user) return reject(404);
                chunk.clientName = `${_user.firstName} ${_user.lastName}`;
                data.push(chunk);
                next();
              })
              .catch(next);
          }
        }, err => {
          if(err) {
            sails.log.error(err);
            return reject();
          }

          return resolve(data);
        });
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });

  });
}

function payrollTable (data) {
  return new Promise((resolve, reject) => {
    async.eachOf(data, (value, key, next) => {
      payrollParseGroup(value)
        .then(_group => {
          data[key] = _group;
          next();
        })
        .catch(next);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(data);
    });
  });
}

function performanceParseTrainer (trainings) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: trainings[0].trainerId.user })
      .then(_trainer => {
        if(!_trainer) return reject(404);

        const data = {
          trainerName: `${_trainer.firstName} ${_trainer.lastName}`,
          totalHours: 0,
          clients: Object.keys(_.groupBy(trainings, x => x.mainClient ? x.mainClient.id : x.buildingId.id)).length // get length of uniq clients
        };

        for (let prop of trainings) {
          data.totalHours += prop.duration;
        }

        data.totalHours = Math.round(data.totalHours / 60);
        data.retentionFactor = (data.totalHours / data.clients).toFixed(2);

        return resolve(data);
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
  });
}

function performanceTable (groups) {
  return new Promise((resolve, reject) => {
    const data = [];

    async.eachSeries(groups, (groupOfTrainigs, next) => {

      performanceParseTrainer(groupOfTrainigs)
        .then(_trainerPerformanceInfo => {
          data.push(_trainerPerformanceInfo);
          next();
        })
        .catch(next);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(data);
    });
  });
}

function sessionsTable (groups) {
  return new Promise((resolve, reject) => {
    const data = [];

    async.eachSeries(groups, (trainings, next) => {
      const seed = {};

      User.findOne({ email: trainings[0].mainClient.user })
        .then(_client => {
          if(!_client) return reject(404);

          seed.clientName = `${_client.firstName} ${_client.lastName}`;

          return User.findOne({ email: trainings[0].trainerId.user });
        })
        .then(_trainer => {
          seed.trainerName = `${_trainer.firstName} ${_trainer.lastName}`;
          seed.serviceName = trainings[0].type.name;
          seed.numbeOfVisits = trainings.length;

          data.push(seed);
          next();
        })
        .catch(next);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(data);
    });
  });
}

module.exports = {
  analyze (data) {
    /**
      Report, Date, Staff member, Class Type
      1. Staff Payroll a custom report ony for one specifited trainer - done
      2. Staff Performance (Staff name | Total hours during time period | Unique clients during time period| Retention Factor | )
      3. Staff Sesions (Graph + Table)(X = Volume, Y = Time)(Table: Client name| Service Category| Staff name| # of Visits | Location)
    */
    return new Promise((resolve, reject) => {
      const criteria = {
        where: {
          trainerId: data.trainerId,
          type: data.type
        },
        sort: 'id ASC'
      };

      criteria.where = Utilities.cleanProps(criteria.where);
      criteria.where.date = { '>=': data.start, '<=': data.end };
      criteria.where.trainerId = { '!': null };

      Training.find(criteria)
        .populateAll()
        .then(_trainings => {

          switch (data.reportType) {
            case 'payroll':{
              const table = _.groupBy(_trainings, x => x.type.name);

              payrollTable(table)
                .then(resolve)
                .catch(reject);
              break;
            }
            case 'performance':{
              const table = _.groupBy(_trainings, x => x.trainerId.user);

              performanceTable(table)
                .then(resolve)
                .catch(reject);
              break;
            }
            case 'sessions': {
              // INFO: Only personl tranings
              const personalTrainings = _trainings.filter(item => item.type.personal);
              const graph = _.groupBy(personalTrainings, x => Utilities.getStartOfDay(x.date));

              for(let prop in graph) {
                if (graph.hasOwnProperty(prop)) {
                  graph[prop] = graph[prop].length;
                }
              }
              const groupedByTypes = _.groupBy(personalTrainings, x => `${x.type.name} ${x.mainClient.user}`);
              sessionsTable(groupedByTypes)
                .then(_table => {
                  return resolve({ graph: graph, table: _table });
                })
                .catch(reject);
              break;
            }
            default:
              return reject(400);
          }
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
