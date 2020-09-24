'use strict';
const faker = require('faker');

describe('#Invoice service', () => {

  describe('#Create pdf', () => {
    it('#should return fulfilled with task object', done => {
      InvoiceService.create({
        email: 'kamil.orzelek@redvike.pl',
        name: faker.name.findName(),
        products: [
          {name: faker.commerce.productName(), price: faker.random.number()},
          {name: faker.commerce.productName(), price: faker.random.number()},
          {name: faker.commerce.productName(), price: faker.random.number()},
          {name: faker.commerce.productName(), price: faker.random.number()},
          {name: faker.commerce.productName(), price: faker.random.number()}
        ]
      })
        .then(() => {
          return done();
        })
        .catch(err => done(Error(err)));
    });

  });

});
