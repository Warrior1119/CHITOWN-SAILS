'use strict';
const supertest = require('supertest');
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Training controller', () => {

  let sailsSid;
  let trainerSid;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;

      mock.createTrainerSession()
      .then(_sid => {
        trainerSid = _sid;
        return done();
      })
      .catch(done);
    })
    .catch(done);
  });

  describe('#Training create', () => {

    let mockTrainer;
    let mockClients;
    let mockBuilding;
    let mockTrainingType;
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

                  mock.createTrainingType()
                    .then(_trainingTypes => {
                      mockTrainingType = _trainingTypes[0];

                      return done();
                    })
                    .catch(done);
                })
                .catch(done);
            })
            .catch(done);
        })
        .catch(done);
    });

    it('#group training', done => {
      supertest(sails.hooks.http.app)
       .post('/training')
       .set('token', sailsSid.token)
       .send({
         name: fakeTrainingName,
         date: new Date().getTime(),
         trainerId: mockTrainer.id,
         duration: faker.random.number(),
         type: mockTrainingType.name,
         cost: 15,
         capacity: 10,
         buildingId: mockBuilding.id,
         trainerCost: 300
       })
       .expect(201)
       .expect(res => {
         assert.equal(res.body.name, fakeTrainingName);
         assert.equal(res.body.type, mockTrainingType.name);
         assert.equal(res.body.cost, 15);
         assert.equal(res.body.capacity, 10);
         assert.equal(res.body.trainerId, mockTrainer.id);
         assert.equal(res.body.event, false);
       })
       .end(done);
    });

    it('#personal training with trainer token', done => {
      supertest(sails.hooks.http.app)
       .post('/training')
       .set('token', trainerSid.token)
       .send({
         name: fakeTrainingName,
         date: new Date().getTime(),
         clients: [mockClients[0].id, mockClients[1].id],
         mainClient: mockClients[0].id,
         duration: 60,
         type: mockTrainingType.name,
         cost: 0,
         capacity: 3,
       })
       .expect(201)
       .expect(res => {
         assert.equal(res.body.name, fakeTrainingName);
         assert.equal(res.body.mainClient, mockClients[0].id);
         assert.equal(res.body.type, mockTrainingType.name);
         assert.equal(res.body.cost, 0);
         assert.equal(res.body.capacity, 3);
       })
       .end((err) => {
         if(err) throw err;
         Schedule.find({
           clientId: [mockClients[0].id, mockClients[1].id]
         })
          .then(_schedules => {
            assert.equal(_schedules.length, 2);
            return done();
          })
          .catch(done);
       });
    });

    it('#personal training with admin/manager token', done => {
      supertest(sails.hooks.http.app)
       .post('/training')
       .set('token', sailsSid.token)
       .send({
         name: fakeTrainingName,
         date: new Date().getTime(),
         clients: [mockClients[0].id, mockClients[1].id],
         mainClient: mockClients[0].id,
         duration: faker.random.number(),
         type: mockTrainingType.name,
         trainerId: mockTrainer.id,
         cost: 0,
         capacity: 3,
       })
       .expect(201)
       .expect(res => {
         assert.equal(res.body.name, fakeTrainingName);
         assert.equal(res.body.mainClient, mockClients[0].id);
         assert.equal(res.body.type, mockTrainingType.name);
         assert.equal(res.body.trainerId, mockTrainer.id);
         assert.equal(res.body.cost, 0);
         assert.equal(res.body.capacity, 3);
       })
       .end((err) => {
         if(err) throw err;
         Schedule.find({
           clientId: [mockClients[0].id, mockClients[1].id]
         })
          .then(_schedules => {
            assert.equal(_schedules.length, 2);
            return done();
          })
          .catch(done);
       });
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .post('/training')
       .set('token', sailsSid.token)
       .send({
         name: fakeTrainingName,
         date: new Date().getTime(),
         clients: null,
         mainClient: null,
         duration: faker.random.number(),
         type: mockTrainingType.name,
         trainerId: mockTrainer.id,
         cost: 0,
         capacity: 3,
       })
       .expect(400)
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .post('/training')
       .set('token', sailsSid.token)
       .send({
         name: fakeTrainingName,
         date: new Date().getTime(),
         trainerId: mockTrainer.id,
         clients: ["�","�"],
         duration: faker.random.number(),
         type: 'Yoga',
         cost: 15,
         buildingId: mockBuilding.id
       })
       .expect(400)
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .post('/training')
       .set('token', sailsSid.token)
       .send({
         name: fakeTrainingName,
         trainerId: mockTrainer.id,
         clients: [mockClients[0].id, mockClients[1].id],
         duration: faker.random.number(),
         type: 'Yoga',
         cost: 15,
         buildingId: mockBuilding.id
       })
       .expect(400)
       .end(done);
    });
  });

  describe('#Training update', () => {
    let mockTraining;
    let clientSid;
    const fakeName = faker.commerce.productName();

    beforeEach(done => {
      mock.createTraining()
        .then(_trainings => {
          mockTraining = _trainings[0];

          mock.createClientSession()
          .then(_sid => {
            clientSid = _sid;
            return done();
          })
          .catch(done);
        })
        .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .put('/training/' + mockTraining.id)
       .set('token', sailsSid.token)
       .send({name: fakeName})
       .expect(200)
       .expect(res => {
         assert.equal(res.body.name, fakeName);
       })
       .end(done);
    });

    it.skip('#should respond 200 status only with updated clients field', done => {
      supertest(sails.hooks.http.app)
       .put('/training/' + mockTraining.id)
       .set('token', clientSid.token)
       .expect(200)
       .end(done);
    });
  });

  describe('#Training update - signed out form training', () => {
    let data;

    beforeEach(done => {
      mock.createSignedClientToTrainingWithSession()
        .then(_data => {
          data = _data ;
          return done();
        })
        .catch(done);
    });

    it('#should respond 200 status only with updated clients field', done => {
      supertest(sails.hooks.http.app)
       .put('/training/' + data.training.id)
       .set('token', data.session.token)
       .expect(200)
       .end(done);
    });
  });
});
