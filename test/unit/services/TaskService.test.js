'use strict';
const mock = require('./../../mocks.js');
const faker = require('faker');
const assert = require('assert');

describe('#Task service', () => {

  describe('#Create task', () => {
    let seed;

    beforeEach(done => {
      mock.createManager()
        .then(_managers => {
          mock.createTrainer()
            .then(_trainers => {
              seed = {
                name: faker.lorem.sentence(),
                description: faker.lorem.sentence(),
                managerId: _managers[0].id,
                user: _trainers[0].user
              };
              return done();
            })
            .catch(err => done(Error(err)));
        })
        .catch(err => done(Error(err)));
    });
    it('#should return fulfilled with task object', done => {
      TaskService.create(Object.assign({}, seed))
        .then(_task => {
          assert.equal(_task.name, seed.name);
          assert.equal(_task.description, seed.description);
          assert.equal(_task.managerId, seed.managerId);
          assert.equal(_task.user, seed.user);
          return done();
        })
        .catch(err => done(Error(err)));
    });

  });

  describe('#Update task', () => {
    let mockTask;
    let mockTaskName = faker.lorem.sentence();

    beforeEach(done => {
      mock.createTask()
        .then(_task => {
          mockTask = _task[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with prospect task object', done => {
      TaskService.update(mockTask.id, {name: mockTaskName})
        .then(_task => {
          assert.equal(_task.name, mockTaskName);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });

  describe('#Destroy task', () => {
    let mockTask;

    beforeEach(done => {
      mock.createTask()
        .then(_task => {
          mockTask = _task[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled without content', done => {
      TaskService.destroy(mockTask.id)
        .then(done)
        .catch(err => done(Error(err)));
    });
  });

  describe('#Find tasks', () => {
    beforeEach(done => {
      mock.createTask(3)
        .then(() => done())
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with content', done => {
      TaskService.find({start: 0, end: 3})
        .then(_tasks => {
          assert.equal(_tasks.length, 3);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });

  describe('#Find one task', () => {
    let mockTask;

    beforeEach(done => {
      mock.createTask()
        .then(_task => {
          mockTask = _task[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });


    it('#should return fulfilled with content', done => {
      TaskService.findOne(mockTask.id)
        .then(_task => {
          assert.equal(_task.id, mockTask.id);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });
});
