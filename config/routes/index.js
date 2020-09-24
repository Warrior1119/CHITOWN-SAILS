'use strict';
/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = require('lodash').merge(
  require('./activation.js'),
  require('./admin.js'),
  require('./analytics.js'),
  require('./announcement.js'),
  require('./booking-type.js'),
  require('./booking.js'),
  require('./building.js'),
  require('./category.js'),
  require('./client.js'),
  require('./diet.js'),
  require('./download.js'),
  require('./health.js'),
  require('./invoice.js'),
  require('./manager.js'),
  require('./measurements.js'),
  require('./notification.js'),
  require('./password.js'),
  require('./product.js'),
  require('./promo.js'),
  require('./schedule.js'),
  require('./session.js'),
  require('./shop.js'),
  require('./sku.js'),
  require('./task.js'),
  require('./trainer.js'),
  require('./training-type.js'),
  require('./training.js'),
  require('./user.js'),
  require('./neighbourhood.js'),
  require('./book.js'),
  require('./universal-link.js'),
);
