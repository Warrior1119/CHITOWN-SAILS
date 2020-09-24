'use strict';
const mock = require('./../../mocks.js');
const faker = require('faker');
const assert = require('assert');

describe('#Prospect service', () => {

  describe('#Create prospect template task', () => {
    it('#should return fulfilled with prospect task object', done => {
      ProspectService.create({
        name: faker.lorem.sentence(),
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit'
      })
        .then(_prospectTask => {
          assert.notEqual(_prospectTask, {});
          return done();
        })
        .catch(err => done(Error(err)));
    });

  });

  describe('#Update prospect template task', () => {
    let mockProspectTask;
    let mockProspectTaskName = faker.lorem.sentence();

    beforeEach(done => {
      mock.createProspectTask()
        .then(_prospectTask => {
          mockProspectTask = _prospectTask[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with prospect task object', done => {
      ProspectService.update(mockProspectTask.id, {name: mockProspectTaskName})
        .then(_prospectTask => {
          assert.equal(_prospectTask.name, mockProspectTaskName);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });

  describe('#Destroy prospect template task', () => {
    let mockProspectTask;

    beforeEach(done => {
      mock.createProspectTask()
        .then(_prospectTask => {
          mockProspectTask = _prospectTask[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled without content', done => {
      ProspectService.destroy(mockProspectTask.id)
        .then(done)
        .catch(err => done(Error(err)));
    });
  });

  describe('#Find prospect template tasks', () => {
    beforeEach(done => {
      mock.createProspectTask(3)
        .then(() => done())
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with content', done => {
      ProspectService.find({start: 0, end: 3})
        .then(_prospectTasks => {
          assert.equal(_prospectTasks.length, 3);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });

  describe('#Find one prospect template task', () => {
    let mockProspectTask;

    beforeEach(done => {
      mock.createProspectTask()
        .then(_prospectTask => {
          mockProspectTask = _prospectTask[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });


    it('#should return fulfilled with content', done => {
      ProspectService.findOne(mockProspectTask.id)
        .then(_prospectTask => {
          assert.equal(_prospectTask.id, mockProspectTask.id);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });
});
