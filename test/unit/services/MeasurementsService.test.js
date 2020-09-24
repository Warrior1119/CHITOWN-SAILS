'use strict';
const mock = require('./../../mocks.js');
const faker = require('faker');
const assert = require('assert');

describe('#Measurements service', () => {

  describe('#Create measurements', () => {
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
            hips: faker.random.number(),
            cb: faker.random.number(),
            thighs: faker.random.number(),
            arms: faker.random.number()
          };
          return done();
        })
        .catch(err => done(Error(err)));
    });
    it('#should return measurement object', done => {
      MeasurementsService.create(Object.assign({}, seed))
        .then(_measurements => {
          assert.equal(_measurements.clientId, seed.clientId);
          assert.equal(_measurements.weight, seed.weight);
          assert.equal(_measurements.height, seed.height);
          assert.equal(_measurements.bfp, seed.bfp);
          assert.equal(_measurements.waist, seed.waist);
          assert.equal(_measurements.hips, seed.hips);
          assert.equal(_measurements.cb, seed.cb);
          assert.equal(_measurements.thighs, seed.thighs);
          assert.equal(_measurements.arms, seed.arms);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });

  describe('#Update measurements', () => {
    let mockMeasurement;

    beforeEach(done => {
      mock.createMeasurements()
        .then(_measurements => {
          mockMeasurement = _measurements[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });
    it('#should return updated measurement object', done => {
      MeasurementsService.update({id: mockMeasurement.id, weight: 123})
        .then(_measurements => {
          assert.equal(_measurements.clientId, mockMeasurement.clientId);
          assert.equal(_measurements.weight, 123);
          assert.equal(_measurements.height, mockMeasurement.height);
          assert.equal(_measurements.bfp, mockMeasurement.bfp);
          assert.equal(_measurements.waist, mockMeasurement.waist);
          assert.equal(_measurements.hips, mockMeasurement.hips);
          assert.equal(_measurements.cb, mockMeasurement.cb);
          assert.equal(_measurements.thighs, mockMeasurement.thighs);
          assert.equal(_measurements.arms, mockMeasurement.arms);
          return done();
        })
        .catch(err => done(Error(err)));
    });

  });

  describe('#Update measurements from client', () => {
    let mockMeasurement;
    let mockUserId;

    beforeEach(done => {
      mock.createClient()
        .then(_clients => {
          mock.createMeasurements(1, _clients[0].id)
          .then(_data => {
            mockUserId = _data.user.id;
            mockMeasurement = _data.data[0];
            return done();
          })
          .catch(err => done(Error(err)));
        })
        .catch(err => done(Error(err)));
    });

    it('#should return updated measurement object', done => {
      MeasurementsService.updateByClient({userID: mockUserId, id: mockMeasurement.id, weight: 123, height: 444})
        .then(_measurements => {
          assert.equal(_measurements.clientId, mockMeasurement.clientId);
          assert.equal(_measurements.weight, 123);
          assert.equal(_measurements.height, 444);
          assert.equal(_measurements.bfp, mockMeasurement.bfp);
          assert.equal(_measurements.waist, mockMeasurement.waist);
          assert.equal(_measurements.hips, mockMeasurement.hips);
          assert.equal(_measurements.cb, mockMeasurement.cb);
          assert.equal(_measurements.thighs, mockMeasurement.thighs);
          assert.equal(_measurements.arms, mockMeasurement.arms);
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return 403 if user try to update measurement which not belong to him', done => {
      MeasurementsService.updateByClient({userID: 1, id: mockMeasurement.id, weight: 123, height: 444})
        .then(data => done(Error(data)))
        .catch(() => done());
    });

    it('#should return 403 if user try to update measurement which not belong to him', done => {
      MeasurementsService.updateByClient({userID: 1, id: mockMeasurement.id, weight: 123, height: 444})
        .then(data => done(Error(data)))
        .catch(() => done());
    });
  });

  describe('#Find measurements', () => {
    let mockMeasurement;

    beforeEach(done => {
      mock.createMeasurements(6)
        .then(_measurements => {
          mockMeasurement = _measurements[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return measurements array', done => {
      MeasurementsService.find({clientId: mockMeasurement.clientId, skip: 0, limit: 4})
        .then(_measurements => {
          assert.equal(_measurements.length, 4);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });

  describe('#Find measurements for client', () => {
    let mockUserId;

    beforeEach(done => {
      mock.createClient()
        .then(_clients => {
          mock.createMeasurements(6, _clients[0].id)
          .then(_data => {
            mockUserId = _data.user;
            return done();
          })
          .catch(err => done(Error(err)));
        })
        .catch(err => done(Error(err)));
    });

    it('#should return measurements array for client', done => {
      MeasurementsService.find({userID: mockUserId, skip: 0, limit: 4})
        .then(_measurements => {
          assert.equal(_measurements.length, 4);
          return done();
        })
        .catch(err => done(Error(err)));
    });

  });
});
