'use strict';

const assert = require('chai').assert;
const ShopItem = require('../../../api/models/ShopItem.js');
describe('#ShopItem model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof ShopItem);
    });
  });

  describe('#Name field structure', () => {
    it('#name "type" should be a string', () => {
      assert.equal('string', ShopItem.attributes.name.type);
    });

    it('#name "required" should be true', () => {
      assert.equal(true, ShopItem.attributes.name.required);
    });
  });

  describe('#Icon field structure', () => {
    it('#icon "type" should be a string', () => {
      assert.equal('string', ShopItem.attributes.icon.type);
    });

    it('#icon "required" should be false', () => {
      assert.equal(false, ShopItem.attributes.icon.required);
    });
  });

  describe('#Color field structure', () => {
    it('#color "type" should be a string', () => {
      assert.equal('string', ShopItem.attributes.color.type);
    });

    it('#color "required" should be false', () => {
      assert.equal(false, ShopItem.attributes.color.required);
    });
  });

  describe('#Description field structure', () => {
    it('#description "type" should be a string', () => {
      assert.equal('string', ShopItem.attributes.description.type);
    });

    it('#description "required" should be true', () => {
      assert.equal(true, ShopItem.attributes.description.required);
    });
  });

  describe('#Category field structure', () => {
    it('#category "type" should be a string', () => {
      assert.equal('string', ShopItem.attributes.category.type);
    });

    it('#category "required" should be true', () => {
      assert.equal(true, ShopItem.attributes.category.required);
    });
  });

  describe('#Price field structure', () => {
    it('#price "type" should be a number', () => {
      assert.equal('number', ShopItem.attributes.price.type);
    });

    it('#price "required" should be true', () => {
      assert.equal(true, ShopItem.attributes.price.required);
    });
  });

  describe('#Duration field structure', () => {
    it('#duration "type" should be a number', () => {
      assert.equal('number', ShopItem.attributes.duration.type);
    });

    it('#duration "required" should be true', () => {
      assert.equal(true, ShopItem.attributes.duration.required);
    });
  });

  describe('#Personal field structure', () => {
    it('#personal "type" should be a boolean', () => {
      assert.equal('boolean', ShopItem.attributes.personal.type);
    });

    it('#personal "required" should be false', () => {
      assert.equal(false, ShopItem.attributes.personal.required);
    });
  });

  describe('#ImageInCategory field structure', () => {
    it('#imageInCategory "type" should be a string', () => {
      assert.equal('string', ShopItem.attributes.imageInCategory.type);
    });

    it('#imageInCategory "defaultsTo" should be "product_image_in_category.png"', () => {
      assert.equal("product_image_in_category.png", ShopItem.attributes.imageInCategory.defaultsTo);
    });
  });

  describe('#Image field structure', () => {
    it('#image "type" should be a string', () => {
      assert.equal('string', ShopItem.attributes.image.type);
    });

    it('#image "defaultsTo" should be "product_image.png"', () => {
      assert.equal("product_image.png", ShopItem.attributes.image.defaultsTo);
    });
  });

  describe('#Active field structure', () => {
    it('#active "type" should be a boolean', () => {
      assert.equal('boolean', ShopItem.attributes.active.type);
    });

    it('#active "defaultsTo" should be true', () => {
      assert.equal(true, ShopItem.attributes.active.defaultsTo);
    });
  });
});
