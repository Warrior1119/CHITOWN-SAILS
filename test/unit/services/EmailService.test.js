'use strict';
const faker = require('faker');

describe('#Email service', () => {

  describe('#Send email', () => {
    it('#should return fulfilled', done => {
      EmailService.sendActivation(faker.internet.email())
      .then(() => done())
      .catch(done);
    });
  });
});
