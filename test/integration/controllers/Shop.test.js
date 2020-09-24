'use strict';
const supertest = require('supertest');
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Shop controller', () => {

  let sailsSid;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;
      return done();
    })
    .catch(err => done(Error(err)));
  });

  describe('#Shop create', () => {
    let seed;

    beforeEach(() => {
      seed = {
        name: faker.commerce.productName(),
        icon: faker.random.word(),
        color: faker.random.word(),
        description: faker.random.word(),
        category: faker.commerce.productMaterial(),
        price: faker.commerce.price(),
        personal: faker.random.boolean()
      };
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/shop')
       .field('name', seed.name)
       .field('icon', seed.icon)
       .field('color', seed.color)
       .field('description', seed.description)
       .field('category', seed.category)
       .field('price', seed.price)
       .field('personal', seed.personal)
       .attach('imageInCategory', './test/assets/redvike.png')
       .attach('image', './test/assets/redvike.png')
       .set('token', sailsSid.token)
       .expect(201)
       .expect(res => {
         assert.equal(res.body.name, seed.name);
         assert.equal(res.body.icon, seed.icon);
         assert.equal(res.body.color, seed.color);
         assert.equal(res.body.description, seed.description);
         assert.equal(res.body.category, seed.category);
         assert.equal(res.body.price, seed.price);
         assert.equal(res.body.priority, seed.priority);
       })
       .end(done);
    });

    it('#should return Shop template', done => {
      supertest(sails.hooks.http.app)
       .post('/shop')
       .set('token', sailsSid.token)
       .send({
         name: seed.name
       })
       .expect(400)
       .end(done);
    });
  });

  describe('#Shop update', () => {

    let shopItem;
    let shopItemName = faker.lorem.word();

    beforeEach(done => {
      mock.createShopItem()
        .then(_shopItems => {
          shopItem = _shopItems[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should respond 204 status', done => {
      supertest(sails.hooks.http.app)
       .put('/shop/' + shopItem.id)
       .set('token', sailsSid.token)
       .send({name: shopItemName})
       .expect(200)
       .expect(res => {
         assert.equal(res.body.name, shopItemName);
       })
       .end(done);
    });
  });

  describe('#Shop destroy', () => {

    let shopItem;

    beforeEach(done => {
      mock.createShopItem()
        .then(_shopItems => {
          shopItem = _shopItems[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should respond 204 status', done => {
      supertest(sails.hooks.http.app)
       .del('/shop/' + shopItem.id)
       .set('token', sailsSid.token)
       .expect(204)
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .del('/shop/asd')
       .set('token', sailsSid.token)
       .expect(400)
       .end(done);
    });
  });

  describe('#Shop find', () => {
    let mockTasksLength;

    beforeEach(done => {
      mock.createShopItem(3)
        .then(_tasks => {
          mockTasksLength = _tasks.length;
          return done();
        })
        .catch(err => done(Error(err)));
    });


    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .get('/shop')
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, mockTasksLength);
       })
       .end(done);
    });
  });
});
