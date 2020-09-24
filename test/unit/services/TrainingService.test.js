'use strict';
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Training service', () => {

  describe('Create training', () => {

    let mockTrainer;
    let mockClients;
    let mockBuilding;
    const fakeTrainingName = faker.commerce.productName();

    beforeEach(done => {
      mock.createTrainer()
        .then(_trainers => {
          mockTrainer = _trainers[0];

          mock.createClient(2)
            .then(_clinets => {
              mockClients = _clinets;

              mock.createBuilding()
                .then(_buildings => {
                  mockBuilding = _buildings[0];
                  return done();
                })
                .catch(done);
            })
            .catch(done);
        })
        .catch(done);
    });

    it('#should return fulfilled', done => {
      TrainingService.create({
        name: fakeTrainingName,
        date: new Date().getTime(),
        trainerId: mockTrainer.id,
        clients: [mockClients[0].id, mockClients[1].id],
        duration: faker.random.number(),
        type: 'Yoga',
        cost: 15,
        capacity: 10,
        buildingId: mockBuilding.id,
        trainerCost: 300
      })
      .then(_training => {
        assert.equal(_training.name, fakeTrainingName);
        assert.equal(_training.capacity, 10);
        return done();
      })
      .catch(done);
    });
  });

  describe('Destroy training', () => {

    let mockTrainig;

    beforeEach(done => {
      mock.createTraining()
        .then(_trainings => {
          mockTrainig = _trainings[0];
          return done();
        })
        .catch(done);
    });

    it('#should return fulfilled', done => {
      TrainingService.destroy(mockTrainig.id)
        .then(() => {
          return done();
        })
        .catch(done);
    });
  });

  describe('Find trainings', () => {

    beforeEach(done => {
      mock.createTraining(3)
        .then(() => done())
         .catch(done);
    });

    it('#should return fulfilled with content', done => {
      TrainingService.find({start: new Date().getTime() - 1000, end: new Date().getTime() + 1000})
        .then(_trainings => {
          assert.equal(_trainings.length, 3);
          return done();
        })
        .catch(done);
    });
  });

  describe('Find one training', () => {

    let mockTraining;

    beforeEach(done => {
      mock.createTraining()
        .then(_trainings => {
          mockTraining = _trainings[0];
          return done();
        })
        .catch(done);
    });

    it('#should return fulfilled with content', done => {
      TrainingService.findOne(mockTraining.id)
        .then(_training => {
          assert.equal(_training.id, mockTraining.id);
          return done();
        })
        .catch(done);
    });
  });

  describe('Update training', () => {

    let mockTraining;
    const fakeName = faker.commerce.productName();

    beforeEach(done => {
      mock.createTraining()
        .then(_trainings => {
          mockTraining = _trainings[0];
          return done();
        })
        .catch(done);
    });

    it('#should return fulfilled with content', done => {
      TrainingService.update(mockTraining.id, {name: fakeName})
        .then(_training => {
          assert.equal(_training.name, fakeName);
          return done();
        })
        .catch(done);
    });
  });
});
