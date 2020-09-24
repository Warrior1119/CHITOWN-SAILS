'use strict';

module.exports.policies = require('lodash').merge(
  require('./main.js'),
  require('./activation.js'),
  require('./admin.js'),
  require('./analytics.js'),
  require('./announcement.js'),
  require('./booking-type.js'),
  require('./building.js'),
  require('./category.js'),
  require('./client.js'),
  require('./diet.js'),
  require('./manager.js'),
  require('./notification.js'),
  require('./password.js'),
  require('./product.js'),
  require('./promo.js'),
  require('./session.js'),
  require('./shop.js'),
  require('./sku.js'),
  require('./task.js'),
  require('./trainer.js'),
  require('./training-type.js'),
  require('./training.js'),
  require('./neighbourhood.js'),
  require('./book.js'),
  require('./universal-link.js'),
);
