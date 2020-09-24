'use strict';
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Schedule service', () => {

  describe('Create schedule', () => {

    let mockTraining;
    let mockClient;
    let mockDate = new Date().getTime();

    beforeEach(done => {
      mock.createTraining()
        .then(_trainings => {
          mockTraining = _trainings[0];

          mock.createClient()
            .then(_clinets => {
              mockClient = _clinets[0];
              return done();
            })
            .catch(done);
        })
        .catch(done);
    });

    it('#should return fulfilled with content', done => {
      ScheduleService.create({
        clientId: mockClient.id,
        date: mockDate,
        trainingId: mockTraining.id
      })
      .then(_schedule => {
        assert.equal(_schedule.clientId, mockClient.id);
        assert.equal(_schedule.date, mockDate);
        assert.equal(_schedule.trainingId, mockTraining.id);
        return done();
      })
      .catch(done);
    });
  });

  describe('Find schedules', () => {

    let mockUser;

    beforeEach(done => {
      mock.createSchedule(3)
        .then(_schedules => {
          Client.findOne({id: _schedules[0].clientId})
            .populateAll()
            .then(_client => {
              mockUser = _client.user;
              return done();
            })
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
         .catch(done);
    });

    it('#should return fulfilled with content', done => {
      ScheduleService.find({start: new Date().getTime() - 1000, end: new Date().getTime() + 1000, userID: mockUser.id})
        .then(_schedules => {
          assert.equal(_schedules.length, 3);
          return done();
        })
        .catch(done);
    });
  });

  describe('Find one schedule', () => {

    let mockSchedule;
    let mockUser;

    beforeEach(done => {
      mock.createSchedule()
        .then(_schedules => {
          Client.findOne({id: _schedules[0].clientId})
            .populateAll()
            .then(_client => {
              mockSchedule = _schedules[0];
              mockUser = _client.user;
              return done();
            })
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
        })
         .catch(done);
    });

    it('#should return fulfilled with content', done => {
      ScheduleService.findOne({id: mockSchedule.id, userID: mockUser.id})
        .then(_schedule => {
          assert.equal(_schedule.id, mockSchedule.id);
          return done();
        })
        .catch(done);
    });
  });
});
