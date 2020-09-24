'use strict';
const Cron = require('cron').CronJob;

function clientWeekReport () {
  new Cron('00 00 09 * * *', function () {
    const start = new Date(new Date().getTime() - sails.config.custom.timestamps.week);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(24, 0, 0, 0);

    const managersEmail = [];

    Manager.find()
      .then(_managers => {
        if(!_managers.length) return;
        else {
          for (let manager of _managers) {
            managersEmail.push(manager.user);
          }

          return Client.find({ createdAt: { '>=': start, '<=': end } }).populateAll();
        }
      })
      .then(_clients => {
        if(!_clients.length) return;
        else {
          let clientNames = '';
          for (let client of _clients) {
            clientNames += `${client.user.firstName} ${client.user.lastName}(${client.user.email}) \n`;
          }

          return EmailService.oneWeekManager({ emails: managersEmail, clientNames: clientNames });
        }
      })
      .then()
      .catch(err => {
        sails.log.error(err);
      });
  }, null, true, 'America/Chicago');
}

function clientMonthReport () {
  new Cron('00 00 09 * * *', function () {
    console.log(new Date());
    const start = new Date(new Date().getTime() - sails.config.custom.timestamps.month);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(24, 0, 0, 0);

    const managersEmail = [];

    Manager.find()
      .then(_managers => {
        if(!_managers.length) return;
        else {
          for (let manager of _managers) {
            managersEmail.push(manager.user);
          }

          return Client.find({ createdAt: { '>=': start, '<=': end } }).populateAll();
        }
      })
      .then(_clients => {
        if(!_clients.length) return;
        else {
          let clientNames = '';
          for (let client of _clients) {
            clientNames += `${client.user.firstName} ${client.user.lastName}(${client.user.email}) \n`;
          }

          return EmailService.oneMonthManager({ emails: managersEmail, clientNames: clientNames });
        }
      })
      .then()
      .catch(err => {
        sails.log.error(err);
      });
  }, null, true, 'America/Chicago');
}

function clientMeasurement30dayOff () {
  new Cron('00 00 09 * * *', function () {
    const start = new Date(new Date().getTime() - sails.config.custom.timestamps.month - sails.config.custom.timestamps.day);
    start.setHours(0, 0, 0, 0);

    const monthAgo = new Date(new Date().getTime() - sails.config.custom.timestamps.month);
    monthAgo.setHours(24, 0, 0, 0);

    const managersEmail = [];

    Manager.find()
      .then(_managers => {
        if(!_managers.length) return;
        else {
          for (let manager of _managers) {
            managersEmail.push(manager.user);
          }

          return Measurements.find({
            where: {
              createdAt: { '>=': start }
            },
            sort: 'id ASC'
          }).populateAll();
        }
      })
      .then(_measurements => {
        if(!_measurements.length) return;
        else {
          const groupedByUser = _.groupBy(_measurements, x => x.clientId.user);
          const clients = [];
          let clientNames = '';

          async.eachSeries(groupedByUser, (measurement, next) => {
            if(measurement[measurement.length-1].createdAt < monthAgo.getTime()) { // if there is no new mesaurement in month
              clients.push(measurement[measurement.length-1].clientId.user);
            }
            next();
          }, err => {
            if(err) {
              sails.log.error(err);
              return;
            }

            if(!clients.length) return;

            User.find({ email: clients })
              .then(_users => {
                if(!_users.length) return;
                for (let user of _users) {
                  clientNames += `${user.firstName} ${user.lastName}(${user.email}) <br />`;
                }

                return EmailService.withoutMeasurements({ emails: managersEmail, clientNames: clientNames });
              })
              .catch(err => {
                sails.log.error(err);
                return;
              });
          });
        }
      })
      .then()
      .catch(err => {
        sails.log.error(err);
      });
  }, null, true, 'America/Chicago');
}

function clientRemindAppointment () {
  new Cron('00 30 06 * * *', function () {
    const start = new Date().setHours(0, 0, 0, 0);
    const end = new Date().setHours(24, 0, 0, 0);
    const appointments = new Map();

    Training
      .find({ date : { '>=' : start, '<' : end } })
      .populate('clients')
      .then(trainings => {
        if (!trainings.length) return;
        const clients = new Set();

        for (let training of trainings) {
          const productName = training.capacity > 3 ?
            `${training.name}` : `${training.name} (${training.type})`;


          for (let _client of training.clients) {
            clients.add(_client.user);
            if (appointments.has(_client.user)) {
              const products = appointments.get(_client.user);
              appointments.set(_client.user, products.add(productName));
            } else {
              appointments.set(_client.user, new Set().add(productName));
            }
          }

        }

        return Client.find({ user : Array.from(clients) }).populate('user');
      })
      .then(clients => {
        async.eachSeries(clients, (_client, next) => {
          const products = Array.from(appointments.get(_client.user.email));
          Promise
            .all(products.map(_p => EmailService.remindAppointment(_client, _p)))
            .then(() => next())
            .catch(err => sails.log.error(err));
        }, err => {
          if (err) {
            sails.log.error(err);
            return;
          }
        });
      })
      .catch(err => {
        sails.log.error(err);
      });
  }, null, true, 'America/Chicago');
}

function trainerRemindAppointment () {
  new Cron('00 30 06 * * *', function () {
    const start = new Date().setHours(0, 0, 0, 0);
    const end = new Date().setHours(24, 0, 0, 0);
    const appointments = new Map();

    Training
      .find({ date : { '>=' : start, '<' : end } })
      .populate('trainerId')
      .then(trainings => {
        if (!trainings.length) return;
        const trainers = new Set();

        for (let _training of trainings) {
          trainers.add(_training.trainerId.user);
          const trainingData = {
            date : _training.date,
            name : `${_training.name} (${_training.type})`,
          };

          if (appointments.has(_training.trainerId.user)) {
            const _trainings = appointments.get(_training.trainerId.user);
            appointments.set(_training.trainerId.user, _trainings.add(trainingData));
          } else {
            appointments.set(_training.trainerId.user, new Set().add(trainingData));
          }
        }

        return Trainer.find({ user : Array.from(trainers) }).populate('user');
      })
      .then(trainers => {
        async.eachSeries(trainers, (_trainer, next) => {
          const _trainings = Array.from(appointments.get(_trainer.user.email));
          Promise
            .all(_trainings.map(_t => EmailService.remindAppointmentTrainer(_trainer, _t.name, _t.date)))
            .then(() => next())
            .catch(err => sails.log.error(err));
        }, err => {
          if (err) {
            sails.log.error(err);
            return;
          }
        });
      })
      .catch(err => {
        sails.log.error(err);
      });
  }, null, true, 'America/Chicago');
}

function clientFirstVisit () {

  new Cron('00 00 09 * * *', function () {
    const start = new Date().setHours(0, 0, 0, 0);
    const end = new Date().setHours(24, 0, 0, 0);
    Schedule
      .getDatastore()
      .sendNativeQuery(`SELECT DISTINCT(client_id), training_id
        FROM schedule a
        WHERE a.date < ${end}
        AND a.date >= ${start}
        AND NOT EXISTS (SELECT client_id
                      FROM schedule b
                      WHERE b.client_id = a.client_id
                      AND b.date < ${start})`)
      .then(schedules => {
        if (!schedules.rows.length) return;

        const scheduleList = new Map();
        const clients = new Set();
        const trainings = new Set();

        for (let schedule of schedules.rows) {
          const { training_id : trainingId, client_id : clientId } = schedule;
          clients.add(clientId);
          trainings.add(trainingId);

          if (scheduleList.has(trainingId)) {
            const clients = scheduleList.get(trainingId);
            scheduleList.set(trainingId, clients.add(clientId));
          } else {
            scheduleList.set(trainingId, new Set().add(clientId));
          }
        }

        return Promise.all([
          scheduleList,
          Client.find({ id : Array.from(clients) }).populate('user'),
          Training.find({ id : Array.from(trainings) }),
        ]);
      })
      .then(results => {
        if (results === undefined) return;
        const [ scheduleList, clients, trainings ] = results;

        const clientNames = new Map();
        for (let client of clients) {
          clientNames.set(client.id, `${client.user.firstName} ${client.user.lastName}(${client.user.email})\n`);
        }

        const schedule = new Map();
        const trainers = new Set();
        for (let training of trainings) {
          const { id, trainerId } = training;
          const clients = scheduleList.get(id);
          trainers.add(trainerId);

          if (schedule.has(trainerId)) {
            const _clients = schedule.get(trainerId);
            schedule.set(trainerId, _clients.add(...clients));
          } else {
            schedule.set(trainerId, clients);
          }
        }

        return Promise.all([
          schedule,
          clientNames,
          Trainer.find({ id : Array.from(trainers) }).populate('user'),
          Manager.find().populate('user'),
        ]);
      })
      .then(results => {
        if (results === undefined) return;
        const [ schedule, clientNames, trainers, managers ] = results;

        const managersEmail = [];
        for (let manager of managers) {
          managersEmail.push(manager.user.email);
        }

        async.eachSeries(trainers, (trainer, next) => {
          const clients = Array.from(schedule.get(trainer.id));
          let names = '';
          for (let clientId of clients) {
            names = names + `${clientNames.get(clientId)}\n`;
          }

          const data = {
            emails : managersEmail,
            clientNames : names,
            trainer : trainer,
          };

          EmailService
            .firstVisit(data)
            .then(() => next())
            .catch(err => sails.log.error(err));
        }, err => {
          if (err) {
            sails.log.error(err);
            return;
          }
        });
      })
      .catch(err => sails.log.error(err));
  }, null, true, 'America/Chicago');
}

function clientOneSessionLeftManager () {
  new Cron('00 00 09 * * *', function () {
    Product
      .getDatastore()
      .sendNativeQuery('SELECT DISTINCT(client_id) FROM product WHERE quantity = 1')
      .then(clients => {
        if (!clients.length) return [ [], [] ];
        const _clients = clients.rows.map(_client => _client.client_id);

        return Promise.all([
          Client.find({ id : _clients }).populate('user'),
          Manager.find().populate('user'),
          Trainer.find().populate('user'),
        ]);
      })
      .then(people => {
        const [ clients, managers, trainers ] = people;
        if (!clients.length) return;

        const emails = [];
        for (let _manager of managers) { emails.push(_manager.user.email); }
        for (let _trainer of trainers) { emails.push(_trainer.user.email); }

        let clientNames = '';
        for (let _client of clients) {
          clientNames = clientNames + `${_client.user.firstName} ${_client.user.lastName}(${_client.user.email}) \n`;
        }

        return EmailService.oneLeftManager({
          clientNames,
          emails : emails,
        });
      })
      .catch(err => sails.log.error(err));
  }, null, true, 'America/Chicago');
}

module.exports.bootstrap = function (cb) {
  sails.on('lifted', function () {
    clientWeekReport();
    clientMonthReport();
    clientMeasurement30dayOff();
    clientRemindAppointment();
    clientOneSessionLeftManager();
    clientFirstVisit();
    trainerRemindAppointment();
  });

  return cb();
};
