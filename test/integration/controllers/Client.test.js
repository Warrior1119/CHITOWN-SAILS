'use strict';
const supertest = require('supertest');
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Clinet controller', () => {

  let sailsSid;
  let clientSid;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;

      mock.createClientSession()
      .then(_clietnSid => {
        clientSid = _clietnSid;
        return done();
      })
      .catch(done);
    })
    .catch(done);
  });


  describe('#Client create', () => {

    let mockBuilding;
    beforeEach(done => {

      mock.createBuilding()
        .then(data => {
          mockBuilding = data[0];
          return done();
        })
         .catch(done);

    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/client')
       .field('firstName', faker.name.firstName())
       .field('lastName', faker.name.lastName())
       .field('email', faker.internet.email())
       .field('gender', 'Male')
       .field('phone', '123123123')
       .field('birth', Date.now())
       .field('newsletter', true)
       .field('notification', true)
       .field('fromFacebook', false)
       .field('password', faker.internet.password())
       .attach('avatar', './test/assets/redvike.png')
       .expect(201)
       .expect(res => {
         assert.notEqual(res.body.user.avatar, 'opt/default/avatar.png');
       })
       .end(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/client')
       .field('firstName', faker.name.firstName())
       .field('lastName', faker.name.lastName())
       .field('email', faker.internet.email())
       .field('gender', 'Male')
       .field('phone', '123123123')
       .field('birth', Date.now())
       .field('newsletter', true)
       .field('notification', true)
       .field('buildingId', mockBuilding.code)
       .field('password', faker.internet.password())
       .expect(201)
       .expect(res => {
         assert.equal(res.body.user.avatar, 'opt/default/avatar.png');
       })
       .end(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/client')
       .field('firstName', faker.name.firstName())
       .field('lastName', faker.name.lastName())
       .field('email', faker.internet.email())
       .field('gender', 'Male')
       .field('phone', '123123123')
       .field('password', faker.internet.password())
       .expect(400)
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .post('/client')
       .send({
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         email: faker.internet.email(),
         password: faker.internet.password()
       })
       .expect(400)
       .end(done);
    });
  });

  describe('#Client update', () => {
    let mockClientId;
    const mockClinet = {
      email: 'asdasd@dasdas.pl',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: 'Female',
      phone: 1010101001,
      birth: 123457890,
      newsletter: true,
      notification: true
    };

    beforeEach(done => {
      mock.createClient()
      .then(clients => {
        mockClientId = clients[0].id;
        return done();
      })
      .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .put('/client/' + mockClientId)
       .set('token', clientSid.token)
       .field('firstName', mockClinet.firstName)
       .field('lastName', mockClinet.lastName)
       .field('gender', mockClinet.gender)
       .field('phone', mockClinet.phone)
       .field('birth', mockClinet.birth)
       .field('newsletter', mockClinet.newsletter)
       .field('notification', mockClinet.notification)
       .attach('avatar', './test/assets/redvike.png')
       .expect(200)
       .expect(res => {
         assert.equal(res.body.user.firstName, mockClinet.firstName);
         assert.equal(res.body.user.lastName, mockClinet.lastName);
         assert.equal(res.body.gender, mockClinet.gender);
         assert.equal(res.body.phone, mockClinet.phone);
         assert.equal(res.body.birth, mockClinet.birth);
         assert.equal(res.body.newsletter, mockClinet.newsletter);
         assert.equal(res.body.notification, mockClinet.notification);
       })
       .end(done);
    });
  });

  describe('#Client find one', () => {
    let mockClientId;

    beforeEach(done => {
      mock.createClient()
      .then(clients => {
        mockClientId = clients[0].id;
        return done();
      })
      .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .get('/client/' + mockClientId)
       .set('token', sailsSid.token)
       .expect(res => {
         assert.equal(res.statusCode, 200);
         assert.notEqual(res.body, {});
       })
       .end(done);
    });

    it('#should respond 200 status - Get user dashboard', done => {
      supertest(sails.hooks.http.app)
       .get('/client')
       .set('token', clientSid.token)
       .expect(res => {
         assert.equal(res.statusCode, 200);
         assert.notEqual(res.body, {});
       })
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .get('/client/asd')
       .set('token', sailsSid.token)
       .expect(400)
       .end(done);
    });

    it('#should respond 404 status', done => {
      supertest(sails.hooks.http.app)
       .get('/client/9')
       .set('token', sailsSid.token)
       .expect(404)
       .end(done);
    });
  });

  describe('#Client find', () => {
    let clients;

    beforeEach(done => {
      mock.createClient(4)
      .then(_clients => {
        clients = _clients;
        return done();
      })
      .catch(done);
    });

    it('#should return all clients within range', done => {
      supertest(sails.hooks.http.app)
       .get(`/client/0/${clients.length}`)
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, clients.length);
       })
       .end(done);
    });

    it('#should return all clients within range and provided buildingId', done => {
      supertest(sails.hooks.http.app)
       .get(`/client/0/${clients.length}/${clients[0].buildingId}/0`)
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, clients.length);
       })
       .end(done);
    });

    it('#should return all clients within range and provided buildingId', done => {
      supertest(sails.hooks.http.app)
       .get(`/client/0/${clients.length}/50/0`)
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, 0);
       })
       .end(done);
    });

    it('#should return all clients within range and provided trainerId', done => {
      supertest(sails.hooks.http.app)
       .get(`/client/0/${clients.length}/0/${clients[0].trainerId}`)
       .set('token', sailsSid.token)
       .expect(res => {
         assert.equal(res.body.length, clients.length);
       })
       .end(done);
    });

    it('#should respond 200 status with content', done => {
      supertest(sails.hooks.http.app)
       .get(`/client/0/${clients.length}/${clients[0].buildingId}/${clients[0].trainerId}`)
       .set('token', sailsSid.token)
       .expect(res => {
         assert.equal(res.body.length, clients.length);
       })
       .end(done);
    });
  });

  describe('#Client switch', () => {
    let clientToken;

    beforeEach(done => {
      mock.createClientSession(true)
        .then(_client => {
          clientToken = _client.session.token;

          mock.createTemplateTask(4)
            .then(() => done())
            .catch(done);
        })
        .catch(done);
    });
    it('#should respond 204 and switch client tfrom Freemium to Prospect', done => {
      supertest(sails.hooks.http.app)
       .put('/client/switch')
       .set('token', clientToken)
       .expect(204)
       .end(done);
    });
  });
});
