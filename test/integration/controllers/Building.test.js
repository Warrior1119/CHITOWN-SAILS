'use strict';
const supertest = require('supertest');
const faker = require('faker');
const assert = require('assert');
const mock = require('./../../mocks.js');

describe('#Building controller', () => {

  let sailsSid;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;
      return done();
    })
    .catch(done);
  });


  describe.skip('#Building create', () => {
    let buildingSeed;
    beforeEach(() => {
      buildingSeed = {
        address: faker.address.city(),
        name: faker.company.companyName(),
        code: faker.random.number(),
        phone: faker.random.number(),
        postalCode: faker.random.number()
      };
    });
    it('#should respond with 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/building')
       .set('token', sailsSid.token)
       .field('address', buildingSeed.address)
       .field('name',buildingSeed.name)
       .field('code', buildingSeed.code)
       .field('phone', buildingSeed.phone)
       .field('postalCode', buildingSeed.postalCode)
       .attach('logo', './package.json')
       .attach('image', './package.json')
       .expect(201)
       .expect(res => {
         assert.equal(res.body.address, buildingSeed.address);
         assert.equal(res.body.name, buildingSeed.name);
         assert.equal(res.body.code, buildingSeed.code);
         assert.equal(res.body.phone, buildingSeed.phone);
         assert.equal(res.body.postalCode, buildingSeed.postalCode);
       })
       .end(done);
    });
  });

  describe('#Building find one', () => {

    let mockBuildingId;

    beforeEach(done => {
      mock.createBuilding()
        .then(buildings => {
          mockBuildingId = buildings[0].id;
          return done();
        })
        .catch(done);
    });

    it('#should respond 200 status with content', done => {
      supertest(sails.hooks.http.app)
       .get('/building/' + mockBuildingId)
       .set('token', sailsSid.token)
       .expect(res => {
         assert.equal(res.statusCode, 200);
         assert.notEqual({}, res.body);
       })
       .end(done);
    });

    it('#should respond 404 status', done => {
      supertest(sails.hooks.http.app)
       .get('/building/9999')
       .set('token', sailsSid.token)
       .expect(404)
       .end(done);
    });
  });

  describe('#Building destroy', () => {

    let mockBuildingId;

    beforeEach(done => {
      mock.createBuilding()
        .then(buildings => {
          mockBuildingId = buildings[0].id;
          return done();
        })
       .catch(done);
    });

    it('#should respond with 204 status', done => {
      supertest(sails.hooks.http.app)
       .del('/building/' + mockBuildingId)
       .set('token', sailsSid.token)
       .expect(204)
       .end(done);
    });
  });

  describe('#Building find', () => {

    let mockBuilding = [];

    beforeEach(done => {
      async.times(5, function(n, next) {
        mock.createBuilding()
           .then(building => {
             mockBuilding.push(building.id);
             next();
           })
           .catch(next);
      }, err => {
        if(err) throw Error("Can't create mocks");

        return done();
      });
    });

    it('#should respond 200 status with content', done => {
      supertest(sails.hooks.http.app)
       .get('/building')
       .set('token', sailsSid.token)
       .expect(res => {
         assert.equal(200, res.statusCode);
         assert.equal(5, res.body.length);
       })
       .end(done);
    });
  });

  describe('#Building update', () => {

    let mockBuildingId;

    beforeEach(done => {

      mock.createBuilding()
        .then(buildings => {
          mockBuildingId = buildings[0].id;
          return done();
        })
        .catch(done);
    });


    it('#should respond with 200 status', done => {
      supertest(sails.hooks.http.app)
       .put('/building/' + mockBuildingId)
       .set('token', sailsSid.token)
       .send({address: faker.address.city()})
       .expect(res => {
         assert.equal(200, res.statusCode);
         assert.notEqual({}, res.body);
       })
       .end(done);
    });

    it('#should respond with 200 status', done => {
      supertest(sails.hooks.http.app)
       .put('/building')
       .set('token', sailsSid.token)
       .send({address: faker.address.city()})
       .expect(404)
       .end(done);
    });

    it('#should respond with 200 status', done => {
      supertest(sails.hooks.http.app)
       .put('/building/qweq')
       .set('token', sailsSid.token)
       .send({address: faker.address.city()})
       .expect(400)
       .end(done);
    });
  });
});
