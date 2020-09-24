'use strict';
const supertest = require('supertest');
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Trainer controller', () => {

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


  describe('#Trainer create', () => {

    let seedTrainer;

    beforeEach(done => {
      mock.createShopItem(2)
        .then(_items => {
          seedTrainer = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            gender: 'Male',
            phone: faker.random.number(),
            services: [
              {serviceId: _items[0].id, fee: 200, percentage: false},
              {serviceId: _items[1].id, fee: 20, percentage: true}
            ]
          };
          return done();
        })
        .catch(err => done(new Error(err)));
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/trainer')
       .set('token', sailsSid.token)
       .send(seedTrainer)
       .expect(201)
       .expect(res => {
         assert.equal(res.body.user.firstName, seedTrainer.firstName);
         assert.equal(res.body.user.lastName, seedTrainer.lastName);
         assert.equal(res.body.user.email, seedTrainer.email);
         assert.equal(res.body.gender, seedTrainer.gender);
         assert.equal(res.body.phone, seedTrainer.phone);
         assert.equal(res.body.services.length, 2);
       })
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .post('/trainer')
       .set('token', sailsSid.token)
       .send({
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         email: faker.internet.email()
       })
       .expect(400)
       .end(done);
    });
  });

  describe('#Trainer update', () => {
    let mockTrainer;
    let mockTrainerName;
    let mockServices;

    beforeEach(done => {
      mock.createTrainer()
      .then(_trainers => {
        mockTrainer = _trainers[0];
        mockTrainerName = faker.name.firstName();

        mock.createShopItem(1)
          .then(_items => {
            mockServices = _items;

            return done();
          })
          .catch(err => done(new Error(err)));
      })
      .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .put('/trainer/' + mockTrainer.id)
       .set('token', sailsSid.token)
       .send({firstName: mockTrainerName})
       .expect(200)
       .expect(res => {
         assert.notEqual({}, res.body);
         assert.equal(res.body.user.firstName, mockTrainerName);
       })
       .end(done);
    });

    it('#should return trainer with new ser', done => {
      supertest(sails.hooks.http.app)
       .put(`/trainer/${mockTrainer.id}`)
       .set('token', sailsSid.token)
       .send({
         services: [{serviceId: mockServices[0].id, fee: 300, percentage: false}],
         active: false
       })
       .expect(200)
       .expect(res => {
         assert.equal(res.body.services.length, 1);
         assert.equal(res.body.active, false);
       })
       .end(done);
    });

    it.skip('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .put('/trainer')
       .set('token', trainerSid.token)
       .send({
         user: 'dasd@dasda.com',
         firstName: 'QWE'
       })
       .expect(200)
       .expect(res => {
         assert.notEqual(res.body.user.email, 'dasd@dasda.com');
         assert.equal(res.body.user.firstName, 'QWE');
       })
       .end(done);
    });

    it('#should respond 200 status with deactivated trainer', done => {
      supertest(sails.hooks.http.app)
       .put(`/trainer/${mockTrainer.id}`)
       .set('token', sailsSid.token)
       .send({active: false})
       .expect(200)
       .expect(res => {
         assert.equal(res.body.active, false);
       })
       .end(done);
    });
  });

  describe('#Trainer find one', () => {
    let mockTrainerId;

    beforeEach(done => {
      mock.createTrainer()
      .then(_trainers => {
        mockTrainerId = _trainers[0].id;
        return done();
      })
      .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .get('/trainer/' + mockTrainerId)
       .set('token', sailsSid.token)
       .expect(res => {
         assert.equal(res.statusCode, 200);
         assert.notEqual(res.body, {});
       })
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .get('/trainer/asd')
       .set('token', sailsSid.token)
       .expect(400)
       .end(done);
    });

    it('#should respond 404 status', done => {
      supertest(sails.hooks.http.app)
       .get('/trainer/9')
       .set('token', sailsSid.token)
       .expect(404)
       .end(done);
    });
  });

  describe('#Trainer find', () => {
    let mockTrainers;

    beforeEach(done => {
      mock.createTrainer(2)
      .then(_trainers => {
        mockTrainers = _trainers;
        return done();
      })
      .catch(done);
    });

    it('#should respond 200 status with content', done => {
      supertest(sails.hooks.http.app)
       .get('/trainer/all')
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, mockTrainers.length + 1); // plun one cuz for each test we have trainer for session
       })
       .end(done);
    });
  });
});
