'use strict';
const supertest = require('supertest');
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Manager controller', () => {

  let sailsSid;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;
      return done();
    })
    .catch(done);
  });


  describe('#Manager create', () => {

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/manager')
       .set('token', sailsSid.token)
       .send({
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         email: faker.internet.email(),
         password: faker.internet.password()
       })
       .expect(201)
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .post('/manager')
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

  describe('#Manager update', () => {
    let mockManagerId;
    let mockManagerName;

    beforeEach(done => {
      mock.createManager()
      .then(_managers => {
        mockManagerId = _managers[0].id;
        mockManagerName = faker.name.firstName();
        return done();
      })
      .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .put('/manager/' + mockManagerId)
       .set('token', sailsSid.token)
       .send({firstName: mockManagerName})
       .expect(res => {
         assert.notEqual({}, res.body);
         assert.equal(res.body.user.firstName, mockManagerName);
         assert.equal(200, res.statusCode);
       })
       .end(done);
    });
  });

  describe('#Manager find one', () => {
    let mockManagerId;

    beforeEach(done => {
      mock.createManager()
      .then(_managers => {
        mockManagerId = _managers[0].id;
        return done();
      })
      .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .get('/manager/' + mockManagerId)
       .set('token', sailsSid.token)
       .expect(res => {
         assert.equal(res.statusCode, 200);
         assert.notEqual(res.body, {});
       })
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .get('/manager/asd')
       .set('token', sailsSid.token)
       .expect(400)
       .end(done);
    });

    it('#should respond 404 status', done => {
      supertest(sails.hooks.http.app)
       .get('/manager/9')
       .set('token', sailsSid.token)
       .expect(404)
       .end(done);
    });
  });

  describe('#Manager find', () => {
    beforeEach(done => {
      mock.createManager(5)
      .then(() => done())
      .catch(done);
    });

    it('#should respond 200 status with content', done => {
      supertest(sails.hooks.http.app)
       .get('/manager/0/5')
       .set('token', sailsSid.token)
       .expect(res => {
         assert.equal(res.statusCode, 200);
         assert.equal(res.body.length, 5);
       })
       .end(done);
    });
  });

  describe('#Manager destroy', () => {

    let mockManagerId;

    beforeEach(done => {
      mock.createManager()
        .then(_managers => {
          mockManagerId = _managers[0].id;
          return done();
        })
       .catch(done);
    });

    it('#should respond with 204 status', done => {
      supertest(sails.hooks.http.app)
       .del('/manager/' + mockManagerId)
       .set('token', sailsSid.token)
       .expect(204)
       .end(done);
    });
  });
});
