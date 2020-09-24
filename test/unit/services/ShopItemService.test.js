'use strict';
const mock = require('./../../mocks.js');
const assert = require('assert');
const faker = require('faker');

describe('#ShopItem service', () => {

  describe('Create item', () => {
    let seed;
    beforeEach(() => {
      seed = {
        name: faker.commerce.productName(),
        icon: faker.random.word(),
        color: faker.random.word(),
        description: faker.random.word(),
        category: faker.commerce.productMaterial(),
        price: faker.commerce.price(),
        personal: faker.random.boolean(),
        imageInCategory: faker.random.image(),
        image: faker.random.image()
      };
    });

    it('#should return fulfilled with content', done => {
      ShopItemService.create(seed)
      .then(_item => {
        assert.equal( _item.name, seed.name);
        assert.equal( _item.icon, seed.icon);
        assert.equal( _item.color, seed.color);
        assert.equal( _item.description, seed.description);
        assert.equal( _item.category, seed.category);
        assert.equal( _item.price, seed.price);
        assert.equal( _item.discount, 0);
        assert.equal( _item.personal, seed.personal);
        assert.equal( _item.image_in_category, seed.imageInCategory);
        assert.equal( _item.image, seed.image);
        assert.equal( _item.active, true);
        return done();
      })
      .catch(done);
    });
  });

  describe('Find all items', () => {
    beforeEach(done => {
      mock.createShopItem(4)
        .then(() => done())
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with content', done => {
      ShopItemService.find()
      .then(_items => {
        assert.equal(_items.length, 4);
        return done();
      })
      .catch(done);
    });
  });

  describe('Update item', () => {
    let mockData;
    const data = {name: faker.commerce.productName()};
    beforeEach(done => {
      mock.createShopItem()
        .then(_items => {
          mockData = _items[0];

          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with updated content', done => {
      ShopItemService.update({
        id: mockData.id,
        name: data.name
      })
      .then(_item => {
        TrainingType.findOne({name: data.name})
          .then(_type => {
            assert.equal(_item.id ,mockData.id);
            assert.equal(_item.name , data.name);
            assert.equal(_item.icon, mockData.icon);
            assert.equal(_item.color, mockData.color);
            assert.equal(_item.description, mockData.description);
            assert.equal(_item.category, mockData.category);
            assert.equal(_item.price, mockData.price);
            assert.equal(_item.personal, mockData.personal);
            assert.equal(_item.image_in_category, mockData.image_in_category);
            assert.equal(_item.image, mockData.image);
            assert.equal(_item.active, true);

            //Check type
            assert.equal(_type.name , data.name);
            assert.equal(_type.icon, mockData.icon);
            assert.equal(_type.color, mockData.color);
            assert.equal(_type.personal, mockData.personal);

            return done();
          })
          .catch(err => done(Error(err)));
      })
      .catch(err => done(Error(err)));
    });
  });

  describe('Destroy item', () => {
    let mockData;
    beforeEach(done => {
      mock.createShopItem()
        .then(_items => {
          mockData = _items[0];

          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with updated content', done => {
      ShopItemService.destroy(mockData.id)
      .then(_item => {
        TrainingType.findOne({name: mockData.name})
          .then(_type => {
            if(_type || _item) return done('Can`t delete item');

            return done();
          })
          .catch(err => done(Error(err)));
      })
      .catch(err => done(Error(err)));
    });
  });
});
