'use strict';
const supertest = require('supertest');
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Measurements controller', () => {

  let sailsSid;
  let clientSid;
  let authClient;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;
      mock.createClientSession(true)
      .then(_clientSid => {
        authClient = _clientSid.client;
        clientSid = _clientSid.session;
        return done();
      })
      .catch(err => done(Error(err)));
    })
    .catch(err => done(Error(err)));
  });

  describe('#Measurements create', () => {
    let seed;

    beforeEach(done => {
      mock.createClient()
        .then(_clients => {
          seed = {
            clientId: _clients[0].id,
            weight: faker.random.number(),
            height: faker.random.number(),
            bfp: faker.random.number(),
            waist: faker.random.number(),
            hips: faker.random.number()
          };
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return measurement object created form client', done => {
      supertest(sails.hooks.http.app)
       .post('/measurements')
       .set('token', clientSid.token)
       .send(seed)
       .expect(201)
       .expect(res => {
         assert.equal(res.body.clientId, authClient.id);
         assert.equal(res.body.weight, seed.weight);
         assert.equal(res.body.height, seed.height);
         assert.equal(res.body.bfp, seed.bfp);
         assert.equal(res.body.waist, seed.waist);
         assert.equal(res.body.hips, seed.hips);
       })
       .end(done);
    });

    it('#should return measurement object created form manager', done => {
      supertest(sails.hooks.http.app)
       .post('/measurements')
       .set('token', sailsSid.token)
       .send(seed)
       .expect(201)
       .expect(res => {
         assert.equal(res.body.clientId, seed.clientId);
         assert.equal(res.body.weight, seed.weight);
         assert.equal(res.body.height, seed.height);
         assert.equal(res.body.bfp, seed.bfp);
         assert.equal(res.body.waist, seed.waist);
         assert.equal(res.body.hips, seed.hips);
       })
       .end(done);
    });
  });

  describe('#Measurements update', () => {
    let mockMeasurement;

    beforeEach(done => {
      mock.createMeasurements(1, authClient.id)
        .then(_measurements => {
          mockMeasurement = _measurements.data[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return measurement object updated form client', done => {
      supertest(sails.hooks.http.app)
       .put(`/measurements/${mockMeasurement.id}`)
       .set('token', clientSid.token)
       .send({weight: 123})
       .expect(200)
       .expect(res => {
         assert.equal(res.body.clientId, mockMeasurement.id);
         assert.equal(res.body.weight, 123);
         assert.equal(res.body.height, mockMeasurement.height);
         assert.equal(res.body.bfp, mockMeasurement.bfp);
         assert.equal(res.body.waist, mockMeasurement.waist);
         assert.equal(res.body.hips, mockMeasurement.hips);
       })
       .end(done);
    });

    it('#should return measurement object updated form manager', done => {
      supertest(sails.hooks.http.app)
       .put(`/measurements/${mockMeasurement.id}`)
       .set('token', sailsSid.token)
       .send({weight: 123, waist: 1231231})
       .expect(200)
       .expect(res => {
         assert.equal(res.body.clientId, mockMeasurement.id);
         assert.equal(res.body.weight, 123);
         assert.equal(res.body.height, mockMeasurement.height);
         assert.equal(res.body.bfp, mockMeasurement.bfp);
         assert.equal(res.body.waist, 1231231);
         assert.equal(res.body.hips, mockMeasurement.hips);
       })
       .end(done);
    });
  });

  describe('#Measurements find', () => {
    beforeEach(done => {
      mock.createMeasurements(4, authClient.id)
        .then(() => done())
        .catch(err => done(Error(err)));
    });

    it('#should return measurement object found by client', done => {
      supertest(sails.hooks.http.app)
       .get(`/measurements/0/3`)
       .set('token', clientSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body[0].clientId, authClient.id);
         assert.equal(res.body.length, 3);
       })
       .end(done);
    });

    it('#should return measurement object updated by trainer', done => {
      supertest(sails.hooks.http.app)
       .get(`/measurements/0/3/${authClient.id}`)
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, 3);
       })
       .end(done);
    });
  });

});
