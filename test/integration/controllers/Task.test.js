'use strict';
const supertest = require('supertest');
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Task controller', () => {

  let sailsSid;
  let clientSid;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;
      mock.createClientSession()
      .then(_clientSid => {
        clientSid = _clientSid;
        return done();
      })
      .catch(err => done(Error(err)));
    })
    .catch(err => done(Error(err)));
  });

  describe('#Task create', () => {
    let seed;

    beforeEach(done => {
      mock.createManager()
        .then(_managers => {
          mock.createTrainer()
            .then(_trainers => {
              seed = {
                name: faker.lorem.word(),
                description: faker.lorem.sentence(),
                category: faker.lorem.word(),
                priority: 2,
                managerId: _managers[0].id,
                user: _trainers[0].user
              };
              return done();
            })
            .catch(err => done(Error(err)));
        })
        .catch(err => done(Error(err)));
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/task')
       .set('token', sailsSid.token)
       .send(seed)
       .expect(201)
       .expect(res => {
         assert.equal(res.body.name, seed.name);
         assert.equal(res.body.description, seed.description);
         assert.equal(res.body.category, seed.category);
         assert.equal(res.body.priority, seed.priority);
         assert.equal(res.body.managerId, seed.managerId);
         assert.equal(res.body.user, seed.user);
       })
       .end(done);
    });

    it('#should return task template', done => {
      supertest(sails.hooks.http.app)
       .post('/task')
       .set('token', sailsSid.token)
       .send({
         name: seed.name,
         description: seed.description,
         template: true
       })
       .expect(201)
       .expect(res => {
         assert.equal(res.body.name, seed.name);
         assert.equal(res.body.description, seed.description);
         assert.equal(res.body.template, true);
         assert.equal(res.body.managerId, undefined);
         assert.equal(res.body.user, undefined);
       })
       .end(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/task')
       .set('token', sailsSid.token)
       .send(seed)
       .expect(201)
       .expect(res => {
         assert.equal(res.body.name, seed.name);
         assert.equal(res.body.description, seed.description);
         assert.equal(res.body.managerId, seed.managerId);
         assert.equal(res.body.user, seed.user);
       })
       .end(done);
    });

    it('#should respond 401 status', done => {
      supertest(sails.hooks.http.app)
       .post('/task')
       .set('token', clientSid.token)
       .send(seed)
       .expect(401)
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .post('/task')
       .set('token', sailsSid.token)
       .send({
         name: faker.lorem.sentence()
       })
       .expect(400)
       .end(done);
    });
  });

  describe('#Task update', () => {

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

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .put('/task/' + mockTask.id)
       .set('token', sailsSid.token)
       .send({name: mockTaskName})
       .expect(200)
       .expect(res => {
         assert.equal(res.body.name, mockTaskName);
       })
       .end(done);
    });
    it('#should respond 401 status', done => {
      supertest(sails.hooks.http.app)
       .put('/task/' + mockTask.id)
       .set('token', clientSid.token)
       .send({name: mockTaskName})
       .expect(401)
       .end(done);
    });
  });

  describe('#Task destroy', () => {

    let mockTask;

    beforeEach(done => {
      mock.createTask()
        .then(_task => {
          mockTask = _task[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .del('/task/' + mockTask.id)
       .set('token', sailsSid.token)
       .expect(204)
       .expect(() => {
         Task.findOne({id: mockTask.id})
          .then(_task => {
            assert.equal(_task, undefined);
          })
          .catch(done);
       })
       .end(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .del('/task/' + mockTask.id)
       .set('token', clientSid.token)
       .expect(401)
       .end(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .del('/task/asd')
       .set('token', sailsSid.token)
       .expect(400)
       .end(done);
    });
  });

  describe('#Task find', () => {
    let mockTasksLength;

    beforeEach(done => {
      mock.createTask(3)
        .then(_tasks => {
          mockTasksLength = _tasks.length;
          done();
        })
        .catch(err => done(Error(err)));
    });


    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .get('/task/0/3')
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, mockTasksLength);
       })
       .end(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .get('/task/0/3')
       .set('token', clientSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, mockTasksLength);
       })
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .get('/task/asd/qwe')
       .set('token', sailsSid.token)
       .expect(400)
       .end(done);
    });
  });

  describe('#Task find one', () => {
    let mockTask;

    beforeEach(done => {
      mock.createTask()
        .then(_task => {
          mockTask = _task[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .get('/task/' + mockTask.id)
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.id, mockTask.id);
       })
       .end(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .get('/task/' + mockTask.id)
       .set('token', clientSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.id, mockTask.id);
       })
       .end(done);
    });

    it('#should respond 404 status', done => {
      supertest(sails.hooks.http.app)
       .get('/task/99')
       .set('token', clientSid.token)
       .expect(404)
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .get('/task/asd')
       .set('token', sailsSid.token)
       .expect(400)
       .end(done);
    });
  });
});
