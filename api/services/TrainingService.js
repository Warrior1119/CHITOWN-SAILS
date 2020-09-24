'use strict';

function populateClients (clients) {
  return new Promise((resolve, reject) => {

    async.each(clients, (client, next) => {
      User.findOne({ email: client.user })
        .then(_user => {
          if(_user) client.user = _user;

          next();
        })
        .catch(next);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(clients);
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

function populateTrainersAndSetTaken (trainings, role) {
  return new Promise((resolve, reject) => {
    async.eachSeries(trainings, (training, next) => {
      if(!training.trainerId) {
        if(training.buildingId) {
          getPropertyManager(typeof training.buildingId === 'object' ? training.buildingId.id : training.buildingId)
            .then(propManager => {
              if(!propManager) next();

              propManager.user.role = 'Trainer';

              training.taken = training.clients.length;
              training.trainerId = propManager.user;
              if(role > 4) {
                delete training.clients;
                next();
              } else {
                populateClients(training.clients)
                  .then(_clients => {
                    training.clients = _clients;
                    next();
                  })
                  .catch(next);
              }
            })
            .catch(reject);
        } else {
          next();
        }
      } else {
        User.findOne({ email: training.trainerId.user })
          .then(_user => {
            if(!_user) return reject(404);

            training.taken = training.clients.length;
            training.trainerId = _user;
            if(role > 4) {
              delete training.clients;
              next();
            } else {
              populateClients(training.clients)
                .then(_clients => {
                  training.clients = _clients;
                  next();
                })
                .catch(next);
            }
          })
          .catch(next);
      }
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(trainings);
    });
  });
}

function populateTrainers (trainings) {
  return new Promise((resolve, reject) => {
    async.eachSeries(trainings, (training, next) => {
      if(training.trainerId) {
        User.findOne({ email: training.trainerId.user })
          .then(_user => {
            if(!_user) return reject(404);

            training.trainerId = _user;
            training.taken = training.clients.length;
            delete training.clients;
            next();
          })
          .catch(next);
      } else {
        getPropertyManager(training.buildingId.id)
          .then(propManager => {
            if(!propManager) next();

            propManager.user.role = 'Trainer';

            training.taken = training.clients.length;
            training.trainerId = propManager.user;
            delete training.clients;
            next();
          })
          .catch(next);
      }
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(trainings);
    });
  });
}

function mergeTrainingsWithSchedules (trainings, schedules) {
  return new Promise(function (resolve, reject) {

    async.eachSeries(schedules, (schedule, nextSchedule) => {
      let trainingExist = false;

      for (let training of trainings) {
        if(training.id === schedule.trainingId.id) {
          training.signed = true;
          trainingExist = true;
        }

        training.participation = schedule.participation;
      }

      if(!trainingExist) {
        TrainingType.findOne({ name: schedule.trainingId.type })
          .then(_type => {
            schedule.trainingId.type = _type;
            trainings.push(schedule.trainingId);

            nextSchedule();
          })
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
      } else {
        nextSchedule();
      }
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }
      console.log("trainings......", trainings);
      return resolve(trainings);
    });

  });
}

function setSechedule (clients, training) {
  return new Promise((resolve, reject) => {
    async.eachSeries(clients, (clientId, next) => {
      Schedule.findOrCreate(
        {
          clientId: clientId,
          trainingId: training.id
        },{
          clientId: clientId,
          date: training.date,
          trainingId: training.id
        })
        .then(() => next())
        .catch(next);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }
      return resolve();
    });
  });
}

function setSecheduleForRepeat (clients, trainings) {
  return new Promise((resolve, reject) => {
    async.eachSeries(trainings, (training, next) => {
      setSechedule(clients, training)
        .then(next)
        .catch(next);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }
      return resolve();
    });
  });
}

function addBuildingInfo (trainings) {
  return new Promise((resolve, reject) => {
    async.each(trainings, (training, next) => {
      if(training.buildingId && typeof training.buildingId === 'object') {
        training.buildingInfo = training.buildingId;
        training.buildingId = training.buildingId.id;
        next();
      } else {
        Building.findOne({ id: training.buildingId })
          .then(building => {
            training.buildingInfo = building;
            next();
          })
          .catch(reject);
      }
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(trainings);
    });
  });
}

function notifyCheckedInTraining (trainingId, userEmail) {
  return Promise.all([
    Administrator.find().limit(1),
    Training.findOne({ id: trainingId }).populateAll(),
    Client.findOne({ user: userEmail }).populate('user')
  ])
    .then(([ admin, training, client ]) => {
      return PropertyManager.findOne({ buildingId: training.buildingId.id })
        .then((propertyManager) => {
          return Promise.all([
            EmailService.checkedInTrainingAdmin(admin[0], client, training.name, training.buildingId.name),
            EmailService.checkedInTrainingUser(client, training.name, training.buildingId.name, propertyManager ? propertyManager.user : 'hello@elevatedliving.com')
          ]);
        });
    });
}

function notifyCanceledTrainingByPropertyManager ({ id }, doer) {
  return new Promise((resolve, reject) => {
    Training.findOne({ id: id })
      .populateAll()
      .then(_training => {
        if(_training.clients.length > 0) {
          EmailService.notifiCanceledTraining(
            _training,
            [ ...(_training.clients.map(item => item.user)) ],
            doer
          )
            .then(resolve)
            .catch(reject);
        } else {
          return resolve();
        }
      })
      .catch(reject);
  });
}

function notifyCanceledTraining (training, doerID) {
  return new Promise((resolve, reject) => {
    User.findOne({ id: doerID })
      .then(_user => {
        if(!_user) return reject(404);

        Training.findOne({ id: training.id })
          .populateAll()
          .then(_training => {
            if(_training.clients.length > 0) {
              EmailService.notifiCanceledTraining(
                _training,
                [ ...(_training.clients.map(item => item.user)) ],
                ` ${_user.firstName} ${_user.lastName} (${_user.role})`
              )
                .then(resolve)
                .catch(reject);
            } else {
              return resolve();
            }
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

function buildDataForRepeat (chunk, data, index, weeklyRange) {
  return new Promise((resolve, reject) => {
    if(index > 0) {
      switch (data.schedulerType) {
        case 'daily':
          chunk.date = parseInt(chunk.date) + sails.config.custom.timestamps.day * index;
          break;
        case 'weekly':
          const seed = Object.assign({}, data);
          const currentWeek = parseInt(seed.date) + sails.config.custom.timestamps.week * index;
          const startOfWeek = Utilities.getMonday(new Date(currentWeek)); // get monday timestamp of current week in loop
          chunk = [];

          for (let day of data.week) {
            let tmp = Object.assign({}, seed);
            tmp.date = startOfWeek + weeklyRange[day];
            if(tmp.date <= seed.endDate) chunk.push(tmp);
          }
          break;
        case 'monthly':
          const date = new Date(parseInt(chunk.date));
          const tmpDate = new Date(parseInt(chunk.date));
          chunk.date = tmpDate.setMonth(date.getMonth() + index);

          break;
        default:
          return reject({ errCode: 400, message: `Unknow scheduler type: ${data.schedulerType}` });
      }

      return resolve(chunk);
    } else {
      if(data.schedulerType === 'weekly') {
        const seed = Object.assign({}, data);
        const currentDay = new Date(+data.date).getDay();
        const currentWeek = parseInt(seed.date) + sails.config.custom.timestamps.week * index;
        const startOfWeek = Utilities.getMonday(new Date(currentWeek)); // get monday timestamp of current week in loop
        chunk = [];

        if(!data.week.includes(currentDay)) return reject({ errCode: 400, message: `Training must start in one of days which are u picked in week: CurrentDay:${currentDay} | DaysInWeek: ${data.week}` });

        for (let day of data.week) {
          let tmp = Object.assign({}, seed);
          tmp.date = startOfWeek + weeklyRange[day];
          if(tmp.date >= seed.date) chunk.push(tmp);
        }
      }
      return resolve(chunk);
    }
  });
}

function repeatTrainings (data, clients) {
  return new Promise((resolve, reject) => {
    let firstTraining;
    let times = 0;
    let weeklyRange = {};

    if(data.schedulerType === 'daily') {
      times = (data.endDate - data.date) / sails.config.custom.timestamps.day;
    } else if(data.schedulerType === 'weekly') {
      times = (data.endDate - data.date) / sails.config.custom.timestamps.week;
    } else if(data.schedulerType === 'monthly') {
      times = (data.endDate - data.date) / sails.config.custom.timestamps.month;
    }

    ++times;


    if(data.schedulerType === 'weekly') {
      for(let day of data.week) {
        weeklyRange[day] = sails.config.custom.timestamps.day * (day - 1);
      }
    }

    async.timesSeries(times, (index, next) => {
      buildDataForRepeat(Object.assign({}, data), data, index, weeklyRange)
        .then(chunk => {
          if(!Array.isArray(chunk)) chunk = [ chunk ];

          Training.createEach(chunk)
            .meta({ fetch: true })
            .then(_trainings => {
              if(index === 0) firstTraining = _trainings[0];
              if(clients) {
                return setSecheduleForRepeat(clients, _trainings);
              } else {
                return Promise.resolve();
              }
            })
            .then(next)
            .catch(next);
        })
        .catch(next);
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject(err);
      }

      return resolve(firstTraining);
    });
  });
}

function deleteRepeted (gid, client) {
  return new Promise((resolve, reject) => {
    Training.find({ gid: gid, date: { '>=': new Date().getTime() } })
      .then(_trainings => {

        async.eachSeries(_trainings, (_training, next) => {
          ClientService.signedOutFromTraining(_training.id, client)
            .then(() => next())
            .catch(() => next());
        }, err => {
          if(err) return reject(err);

          return resolve();
        });
      })
      .catch(reject);
  });
}

function addParticipationInfo (trainings) {
  return new Promise((resolve, reject) => {
    async.eachSeries(trainings, (training, next) => {
      Schedule.find({ trainingId: training.id })
        .then(_schedules => {

          for (const schedule of _schedules) {
            for (const client of training.clients) {
              if(client.id === schedule.clientId) client.participation = schedule.participation;
            }
          }

          next();
        })
        .catch(next);
    }, err => {
      if(err) return reject(err);

      return resolve(trainings);
    });
  });
}

function chargeAndUpdateSchedule (training) {
  return new Promise((resolve, reject) => {
    if(!training.type.personal) return resolve();
    Client.findOne({ id: training.mainClient.id })
      .populateAll()
      .then(_client => {
        return ChargeService.chargeForTraining({ client: _client, productName: training.type.name, duration: training.duration, date: training.date, trainer: training.trainerId });
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  createGroup (data, req) {
    return new Promise((resolve, reject) => {
      Building.findOne({ id: data.buildingId, active: true })
        .then(_building => {
          if(!_building) return reject({ errCode: 404, message: 'Building not found' });

          return Trainer.findOne({ id: data.trainerId });
        })
        .then(_trainer => {
          if(!_trainer) return reject({ errCode: 404, message: 'Trainer not found' });

          return TrainingType.findOne({ name: data.type });
        })
        .then(_trainingType => {
          if(!_trainingType) return reject({ errCode: 404, message: `Event type ${data.type} not found` });

          if(!!data.schedulerType){ // repeat trenings
            Training.getDatastore().sendNativeQuery('SELECT gid FROM training GROUP BY gid')
              .then(_lastGID => {
                if(_lastGID.rows.length === 0) _lastGID = 0;
                else _lastGID = _lastGID.rows[_lastGID.rows.length - 1].gid;

                data.gid = _lastGID + 1;

                repeatTrainings(data)
                  .then(resolve)
                  .catch(reject);

                return;
              })
              .catch(err => {
                sails.log.error(err);
                return reject();
              });
          } else {
            const images = [{ file: req.file('image'), dir: './opt/training_images/' }];

            UploadService.uploadImage(images)
            .then(_files => {
              if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');

              Training.create(data) // create just one training
              .meta({ fetch: true })
              .then(resolve)
              .catch(err => {
                sails.log.error(err);
                return reject();
              });
            })
            .catch(reject);
          }
        })
        .then(_training => {
          return resolve(_training);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  createByPropertyManager (data, req) {
    return new Promise((resolve, reject) => {
      TrainingType.findOrCreate(
        {
          name: 'Building Event'
        },{
          name: 'Building Event',
          duration: 0,
          icon: 'building',
          color: '#87abe5',
          personal: false,
          active: true
        })
        .then(() => User.findOne({ id: data.userID }))
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };

          return PropertyManager.findOne({ user: _user.email }).populateAll();
        })
        .then(async (_propertyManger) => {

          if(!_propertyManger) throw { errCode: 404, message: 'Property manager not found' };
          if(!_propertyManger.buildingId) throw { errCode: 404, message: 'Building not found' };

          const images = [{ file: req.file('image'), dir: './opt/training_images/' }];

          const _files = await UploadService.uploadImage(images);
          await UploadService.uploadMany(images);

          if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
            // Define required fields
          data.type = 'Building Event';
          data.buildingId = _propertyManger.buildingId.id;
          data.event = true;

          return Training.create(data).meta({ fetch: true });
        })
        .then(resolve)
        .catch(reject);
    });
  },

  createPersonal (data, req) {
    return new Promise((resolve, reject) => {
      const clients = data.clients;
      Trainer.findOne({ id: data.trainerId })
        .then(_trainer => {
          if(!_trainer) return reject({ errCode: 404, message: 'Trainer not found' });

          return TrainingType.findOne({ name: data.type });
        })
        .then(_trainingType => {
          if(!_trainingType) return reject({ errCode: 404, message: `Event type ${data.type} not found` });

          return Client.findOne({ id: data.mainClient });
        })
        .then(_client => {
          if(!_client) return reject({ errCode: 404, message: 'Main client not found' });

          if(!!data.schedulerType){ // repeat trenings
            Training.getDatastore().sendNativeQuery('SELECT gid FROM training GROUP BY gid')
              .then(_lastGID => {
                _lastGID = _lastGID.rows.length;
                data.gid = _lastGID + 1;

                repeatTrainings(data, clients)
                  .then(resolve)
                  .catch(reject);

                return;
              })
              .catch(err => {
                sails.log.error(err);
                return reject();
              });
          } else {
            const images = [{ file: req.file('image'), dir: './opt/training_images/' }];

            UploadService.uploadImage(images)
            .then(_files => {
              if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');

              Training.create(data) // create just one training
              .meta({ fetch: true })
              .then(_training => {
                setSechedule(clients, _training)
                  .then(resolve)
                  .catch(reject);
              })
              .catch(err => {
                sails.log.error(err);
                return reject();
              });

            })
            .catch(reject);
          }
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  createAssessment (userID) {
    return new Promise((resolve, reject) => {
      let client;
      User.findOne({ id: userID })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };

          return Client.findOne({ user: _user.email }).populateAll();
        })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: 'Client not found' };

          client = _client;

          return Manager.find();
        })
        .then(_managers => {
          const managersEmails = _managers.map(x => x.user);

          return Promise.all([
            EmailService.confirmAssessment(client), // for client
            EmailService.notifyAssessment(managersEmails, client) // for managers
          ]);
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject(err);
        });
    });
  },

  destroy (data) {
    return new Promise((resolve, reject) => {
      Training.findOne({ id: data.id })
        .populateAll()
        .then(_training => {
          if(!_training) throw { errCode: 404, message: 'Training not found' };

          if(data.all === 'true' && _training.gid) {
            sails.config.logDelete.warn(
              'Type: A, UID: ' + data.userID +
              ', GID: ' + _training.gid +
              ', Name: ' + _training.name +
              ', Building: ' + (_training.buildingId !== null ? _training.buildingId.id : null) +
              ', Building name: ' + (_training.buildingId !== null ? _training.buildingId.id : null) +
              ', Duration: ' + _training.duration +
              'min, Main client email: ' + (_training.mainClient !== null ? _training.mainClient.user : null) +
              ', Training type: ' +  _training.type.name
            );
            Training.find({ where: { date: { '>=': Date.now() }, gid: _training.gid } })
              .populateAll()
              .then(_trainings => {
                const trainingsId = _trainings.map(x => x.id);
                async.eachSeries(_trainings, (training, nextTraining) => {
                  async.eachSeries(training.clients, (client, nextClient) => {
                    deleteRepeted(_training.gid, client).then(nextClient).catch(nextClient);
                  }, err => {
                    if(err) return reject(err);

                    nextTraining();
                  });
                }, err => {
                  if(err) return reject(err);

                  Schedule.destroy({ trainingId: trainingsId })
                    .then(() => {
                      return Training.destroy({ where: { date: { '>=': Date.now() }, gid: _training.gid } });
                    })
                    .then(resolve)
                    .catch(reject);
                });

              })
              .catch(reject);
          } else {
            sails.config.logDelete.warn(
              'Type: S, UID: ' + data.userID +
              ', Name: ' + _training.name +
              ', Building: ' + (_training.buildingId !== null ? _training.buildingId.id : null) +
              ', Building name: ' + (_training.buildingId !== null ? _training.buildingId.id : null) +
              ', Duration: ' + _training.duration +
              'min, Main client email: ' + (_training.mainClient !== null ? _training.mainClient.user : null) +
              ', Training type: ' +  _training.type.name
            );
            async.eachSeries(_training.clients, (client, next) => {
              if(_training.date < Date.now()) {
                ClientService.signedOutFromTraining(_training.id, client)
                  .then(() => next())
                  .catch(() => next());
              } else {
                next();
              }
            }, err => {
              if(err) return reject(err);

              Schedule.destroy({ trainingId: data.id })
                .then(() => {
                  return Training.destroy({ id: data.id });
                })
                .then(resolve)
                .catch(reject);
            });
          }
        })
        .catch(reject);
    });
  },

  destroyByTrainer (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject({ errCode: 404, message: 'User not found' });

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) return reject({ errCode: 404, message: 'Trainer not found' });

          return Training.findOne({ id: data.id, trainerId: _trainer.id, date: { '>': new Date().setHours(23,59,59) } });
        })
        .then(_training => {
          if(!_training) return reject({ errCode: 403, message: 'Training not found or training expired' });

          this.destroy(data)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  destroyByPropertyManager ({ userID, id }) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userID })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };

          return PropertyManager.findOne({ user: _user.email });
        })
        .then(_propertyManger => {
          if(!_propertyManger) throw { errCode: 404, message: 'You are not property manager' };

          return Training.findOne({ id:id, buildingId: _propertyManger.buildingId, date: { '>': Date.now() } });
        })
        .then(_training => {
          if(!_training) throw { errCode: 404, message: 'Training not found' };
          if(_training.trainerId) throw { errCode: 403, message: 'You do not have permission to delete this training, because you are not owner of this event' };

          this.destroy({ id })
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  },

  find (data) {
    return new Promise((resolve, reject) => {
      Training.find({
        where: { date: { '>=': data.start, '<=': data.end } },
        sort: 'id DESC'
      })
        .populateAll()
        .then(_trainings => {
          return populateTrainersAndSetTaken(_trainings, 1);
        })
        .then(_trainings => {
          return addParticipationInfo(_trainings);
        })
        .then(resolve)
        .catch(reject);
    });
  },

  updateRepeatTrainer (id, trainerId) {
    return new Promise((resolve, reject) => {
      Training.findOne({ id: id })
        .then(training => {
          if(!training) throw { errCode: 404, message: 'Training not foudn' };
          if(!training.gid) throw { errCode: 403, message: 'Training was not created by repeat fuction' };

          return Training.update({ gid: training.gid, date: { '>=': training.date } }).set({ trainerId: trainerId }).meta({ fetch: true });
        })
        .then(resolve)
        .catch(reject);
    });
  },

  findForBuilding (data) {
    return new Promise((resolve, reject) => {
      Building.findOne({ code: data.buildingCode })
        .then(_building => {
          if(!_building) throw 404;
          return Training.find({
            where: { date: { '>=': data.start, '<=': data.end }, buildingId: _building.id, },
            sort: 'id DESC'
          }).populateAll();
        })
        .then(_trainings => {
          populateTrainers(_trainings)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findByTrainer (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) return reject(404);

          return Training.find({
            where: {
              trainerId: _trainer.id,
              date: { '>=': data.start, '<=': data.end }
            },
            sort: 'id DESC'
          })
            .populate('trainerId')
            .populate('type')
            .populate('buildingId')
            .populate('clients');

        })
        .then(_trainings => {
          return populateTrainersAndSetTaken(_trainings, 2); // 2 is user permission
        })
        .then(_trainings => {
          return addParticipationInfo(_trainings);
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findByPropertyManager ({ userID, start, end }) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userID })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };

          return PropertyManager.findOne({ user: _user.email });
        })
        .then(_propertyManger => {
          if(!_propertyManger) throw { errCode: 404, message: 'You are not property manager' };

          return Training.find({
            where: {
              buildingId: _propertyManger.buildingId,
              date: { '>=': start, '<=': end }
            },
            sort: 'id DESC'
          })
            .populate('trainerId')
            .populate('type')
            .populate('buildingId')
            .populate('clients');

        })
        .then(_trainings => {
          return populateTrainersAndSetTaken(_trainings, 3);
        })
        .then(_trainings => {
          return addParticipationInfo(_trainings);
        })
        .then(resolve)
        .catch(reject);
    });
  },

  findByClient (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: `User not found` };

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: `Client not found` };
          if(!_client.buildingId) {
            ScheduleService.find({ start: data.start, end: data.end, userID: data.userID })
              .then(_schedules => {
                mergeTrainingsWithSchedules([], _schedules)
                  .then(resolve)
                  .catch(reject);
              })
              .catch(reject);
          } else {
            Training.find({
              where: {
                buildingId: _client.buildingId,
                date: { '>=': data.start, '<=': data.end }
              },
              sort: 'id DESC'
            })
              .populate('trainerId')
              .populate('buildingId')
              .populate('type')
              .populate('clients')
              .then(_trainings => {
                ScheduleService.find({ start: data.start, end: data.end, userID: data.userID })
                  .then(_schedules => {
                    populateTrainersAndSetTaken(_trainings, 4)
                      .then(_populatedTrainings => {
                        mergeTrainingsWithSchedules(_populatedTrainings, _schedules)
                          .then(addBuildingInfo)
                          .then(resolve)
                          .catch(reject);
                      })
                      .catch(reject);
                  })
                  .catch(reject);
              })
              .catch(reject);
          }
        })
        .catch(reject);
    });
  },

  trainingClientHistory (data) {
    return new Promise((resolve, reject) => {
      ScheduleService.find({ start: data.start, end: data.end, userID: data.userID })
        .then(_schedules => {
          const filtredTrainings = [];
          if (data.type){
            async.eachSeries(_schedules, (schedule, next) => {
              if(schedule.trainingId.type === data.type) {
                filtredTrainings.push({
                  id: schedule.trainingId.id,
                  date: schedule.trainingId.date,
                  name: schedule.trainingId.name
                });
              }

              next();

            }, err => {
              if(err) {
                sails.log.error(err);
                return reject();
              }

              return resolve(filtredTrainings);
            });
          } else {
            async.eachSeries(_schedules, (schedule, next) => {
              if(schedule.clientId == data.clientId) {
                filtredTrainings.push({
                  id: schedule.trainingId.id,
                  date: schedule.trainingId.date,
                  name: schedule.trainingId.name
                });
              }

              next();

            }, err => {
              if(err) {
                sails.log.error(err);
                return reject();
              }

              return resolve(filtredTrainings);
            });
          }
        })
        .catch(reject);
    });
  },

  trainingClientHistoryByManager (data) {
    return new Promise((resolve, reject) => {
      Client.findOne({ id: data.clientId })
        .populateAll()
        .then(_client => {
          if(!_client) throw { errCode: 404, message: 'Client not found' };

          data.userID = _client.user.id;

          return this.trainingClientHistory(data);
        })
        .then(resolve)
        .catch(reject);
    });
  },

  trainingClientHistoryOptional (data) {
    return new Promise((resolve, reject) => {
      Client.findOne({ id: data.clientId })
        .populateAll()
        .then(_client => {
          if(!_client) throw { errCode: 404, message: 'Client not found' };

          data.userID = _client.user.id;
          if(!_client.buildingId) {
            ScheduleService.find({ start: data.start, end: data.end, userID: data.userID })
              .then(_schedules => {
                mergeTrainingsWithSchedules([], _schedules)
                  .then(resolve)
                  .catch(reject);
              })
              .catch(reject);
          } else {
            Training.find({
              where: {
                buildingId: _client.buildingId.id,
                date: { '>=': data.start, '<=': data.end }
              },
              sort: 'id DESC'
            })
              .populate('trainerId')
              .populate('buildingId')
              .populate('type')
              .populate('clients')
              .then(_trainings => {
                ScheduleService.find({ start: data.start, end: data.end, userID: data.userID })
                  .then(_schedules => {
                    populateTrainersAndSetTaken(_trainings, 4)
                      .then(_populatedTrainings => {
                        mergeTrainingsWithSchedules(_populatedTrainings, _schedules)
                          .then(addBuildingInfo)
                          .then(resolve)
                          .catch(reject);
                      })
                      .catch(reject);
                  })
                  .catch(reject);
              })
              .catch(reject);
          }
        })
        .catch(reject);
    });
  },

  update (id, data, req) {
    return new Promise((resolve, reject) => {
      const doer = data.userID;
      Training.findOne({ id: id })
        .populate('type')
        .then( async (_training) => {
          if(!_training) return reject({ errCode: 404, message: 'Training not found' });
          if(_training.mainClient) delete data.trainingId;
          if(req.permission === 2 && _training.date <= new Date().setHours(23,59,59))
            return reject({ errCode: 403, message: 'You can edit event only to midnight' });

          const images = [{ file: req.file('image'), dir: './opt/training_images/' }];
          const _files = await UploadService.uploadImage(images);
          if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');

          return Training.update({ id: id }).set(data).meta({ fetch: true });
        })
        .then(_training => {
          Schedule.update({ trainingId: _training[0].id })
            .set({ date: _training[0].date })
            .then(() => {

              if(_training[0].canceled) {
                notifyCanceledTraining(_training[0], doer)
                  .then(() => resolve(_training[0]))
                  .catch(reject);
              } else {
                return resolve(_training[0]);
              }
            })
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
        .catch(reject);
    });
  },

  updateByPropertyManager (data) {
    return new Promise((resolve, reject) => {
      const { userID, id } = data;
      let doerName;

      User.findOne({ id: userID })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };
          doerName = ` ${_user.firstName} ${_user.lastName} (${_user.role})`;

          return PropertyManager.findOne({ user: _user.email });
        })
        .then(_propertyManger => {
          if(!_propertyManger) throw { errCode: 404, message: 'You are not property manager' };

          return Training.findOne({ id: id , buildingId: _propertyManger.buildingId });
        })
        .then(_training => {
          if(!_training) throw { errCode: 404, message: 'Training not found' };

          return Training.update({ id: id }).set(data).meta({ fetch: true });
        })
        .then(_training => {
          if(_training[0].canceled) {
            notifyCanceledTrainingByPropertyManager(_training[0], doerName)
              .then(() => resolve(_training[0]))
              .catch(reject);
          } else {
            return resolve(_training[0]);
          }
        })
        .catch(reject);
    });
  },

  updateByClient (id, userId, cardToken) {
    return new Promise((resolve, reject) => {
      let userEmail;

      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject({ errCode: 404, message: 'User not found' });

          userEmail = _user.email;
          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject({ errCode: 404, message: 'Client not found' });
          Schedule.findOne({ clientId: _client.id, trainingId: id })
            .then(_schedule => {
              if(_schedule) {
                ClientService.signedOutFromTraining(id, _client)
                  .then(resolve)
                  .catch(reject);
              } else {
                ClientService.joinToTraining(id, _client, cardToken)
                  .then(() => notifyCheckedInTraining(id, userEmail))
                  .then(resolve)
                  .catch(reject);
              }
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },

  cancelAllFollowing (id, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject(404);

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);

          Schedule.findOne({ clientId: _client.id, trainingId: id })
            .populate('trainingId')
            .then(_schedule => {
              if(_schedule) {
                if(!_schedule.trainingId.gid) return reject(401); // training was not created using repeat func

                deleteRepeted(_schedule.trainingId.gid, _client)
                  .then(resolve)
                  .catch(reject);
              } else {
                return reject(401);
              }
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
  },

  checkInTrainer (data) {
    return new Promise((resolve, reject) => {
      let trainer;
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject({ errCode: 404, message: 'User not found' });
          trainer = _user;

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) return reject({ errCode: 404, message: 'Trainer not found' });

          return Training.findOne({ id: data.id, trainerId: _trainer.id }).populateAll();
        })
        .then(_training => {
          if(!_training) return reject({ errCode: 404, message: 'Training not found' });

          _training.trainerId.user = trainer;

          chargeAndUpdateSchedule(_training)
            .then(() => {
              async.each(data.clients, (client, next) => {
                Schedule.update({ clientId: client, trainingId: _training.id }).set({ participation: true })
                  .then(next)
                  .catch(next);
              }, err => {
                if(err) {
                  sails.log.error(err);
                  return reject();
                }

                return resolve();
              });
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },

  checkInByManager (data) {
    return new Promise((resolve, reject) => {
      Training.findOne({ id: data.id })
        .populateAll()
        .then(_training => {
          if(!_training) return reject({ errCode: 404, message: 'Training not found' });

          User.findOne({ email: _training.trainerId.user })
            .then(_user => {
              if(!_user) return reject({ errCode: 404, message: 'Trainer not found' });
              _training.trainerId.user = _user;

              chargeAndUpdateSchedule(_training)
                .then(() => {
                  async.each(data.clients, (client, next) => {
                    Schedule.update({ clientId: client, trainingId: _training.id }).set({ participation: true })
                      .then(next)
                      .catch(next);
                  }, err => {
                    if(err) {
                      sails.log.error(err);
                      return reject();
                    }

                    return resolve();
                  });
                })
                .catch(reject);
            })
            .catch(reject);

        })
        .catch(reject);
    });
  },

  notifyParticipants (trainingId, data, token) {
    return new Promise((resolve, reject) => {
      let senderName = '';
      User.findOne({ id: token.userID })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };
          if(user.role === 'Client' || user.role === 'Trainer') throw { errCode: 403, message: 'Access denied' };

          return user;
        })
        .then(user => {
          senderName = `${user.firstName} ${user.lastName}`;
          if(user.role === 'PropertyManager')
            return PropertyManager.findOne({ user: user.email }).populate('user');
          else
            return user;
        })
        .then(user => {
          const criteria = { id: trainingId };

          if(user.user && user.user.role === 'PropertyManager')
            criteria.buildingId = user.buildingId;

          return Training.findOne(criteria).populate('clients');
        })
        .then(training => {
          if(!training) throw { errCode: 404, message: 'Training not found' };
          if(training.clients.length === 0) throw { errCode: 403, message: 'No one has signed up for this event' };

          const emails = training.clients.map(x => x.user);

          return EmailService.notifyParticipants(emails, senderName, data);
        })
        .then(resolve)
        .catch(reject);
    });
  },
};
