'use strict';

const stringify = require('csv-stringify');
const fs = require('fs');

const patterns = {
  'Client': require('../../config/valid_patterns/Client.js').client,
  'Client-property-manager': require('../../config/valid_patterns/Client-property-manager.js').clientPropertyManager,
  'ClientAnalytics': require('../../config/valid_patterns/ClientAnalytics.js').clientAnalytics,
  'RedisSession': require('../../config/valid_patterns/RedisSession.js').redissession,
  'Activation': require('../../config/valid_patterns/Activation.js').activation,
  'Announcement': require('../../config/valid_patterns/Announcement.js').announcement,
  'Building': require('../../config/valid_patterns/Building.js').building,
  'Booking': require('../../config/valid_patterns/Booking.js').booking,
  'Buy': require('../../config/valid_patterns/Buy.js').buy,
  'Maintainance': require('../../config/valid_patterns/Maintainance.js').maintainance,
  'Manager': require('../../config/valid_patterns/Manager.js').manager,
  'Measurements': require('../../config/valid_patterns/Measurements.js').measurements,
  'Notification': require('../../config/valid_patterns/Notification.js').notification,
  'ProductStripe': require('../../config/valid_patterns/ProductStripe.js').productstripe,
  'PromoCode': require('../../config/valid_patterns/PromoCode.js').promoCode,
  'PropertyManager': require('../../config/valid_patterns/PropertyManager.js').propertyManager,
  'PropertyManagerTraining': require('../../config/valid_patterns/PropertyManagerTraining.js').propertyManagerTraining,
  'Sales': require('../../config/valid_patterns/Sales.js').sales,
  'Shop': require('../../config/valid_patterns/Shop.js').shop,
  'Sku': require('../../config/valid_patterns/Sku.js').sku,
  'Task': require('../../config/valid_patterns/Task.js').task,
  'TaskTemplate': require('../../config/valid_patterns/TaskTemplate.js').tasktemplate,
  'Trainer': require('../../config/valid_patterns/Trainer.js').trainer,
  'TrainerAnalytics': require('../../config/valid_patterns/TrainerAnalytics.js').trainerAnalytics,
  'Training': require('../../config/valid_patterns/Training.js').training,
  'Neighbourhood': require('../../config/valid_patterns/Neighbourhood.js').neighbourhood,
  'Book': require('../../config/valid_patterns/Book.js').book,
};

module.exports = {
  getMonday ( date ) {
    const day = date.getDay() || 7;
    if( day !== 1 ) {
      let hour = date.getHours();
      let minutes = date.getMinutes();
      date.setHours(-24 * (day - 1));
      date.setHours(hour);
      date.setMinutes(minutes);
    }
    return date.getTime();
  },

  generateCSV (clients) {
    return new Promise((resolve, reject) => {
      const prepareData = [];

      async.each(clients, (client, next) => {
        prepareData.push({
          firstName: client.user.firstName,
          lastName: client.user.lastName,
          email: client.user.email,
          phone: client.phone
        });
        next();
      }, err => {
        if(err) {
          sails.log.error(err);
          return reject();
        }

        stringify(prepareData, { header: true, columns: { firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone' } }, (err, output) => {
          if(err) {
            sails.log.error(err);
            return reject();
          }
          const stream = fs.createWriteStream('./opt/out.csv');
          stream.write(output);
          stream.end();
          return resolve('./opt/out.csv');
        });
      });
    });
  },

  uploadUserAvatar (avatar) {
    return new Promise((resolve, reject) => {
      UploadService.upload({ file: avatar, dir: './opt/avatar/', type: 'image' })
        .then(resolve)
        .catch(reject);
    });
  },

  uploadUserInvoice (invoicePath) {
    return new Promise((resolve, reject) => {
      UploadService.upload({ file: invoicePath, dir: './opt/invoice', type: 'pdf' })
        .then(resolve)
        .catch(reject);
    })
  },

  cleanProps (data) {
    for (let prop in data) {
      if(data[prop] === 0 || data[prop] === '0' || data[prop] == 'null' || data[prop] == 'undefined') //eslint-disable-line
        delete data[prop];
    }
    return data;
  },

  getStartOfDay (timpestamp) {
    return new Date(timpestamp).setHours(0,0,0,0);
  },

  isJSON (obj) {
    return !_.isError(_.attempt(JSON.parse, obj));
  },

  isNumeric (x) {
    return !(isNaN(x)) && (typeof x !== "object") && (x != Number.POSITIVE_INFINITY) && (x != Number.NEGATIVE_INFINITY); //eslint-disable-line
  },

  parseJsonToBool (data) {
    return data === 'true' ? true : false;
  },

  maxLength (data, max) {
    if(data === undefined) return false;
    else if(data.length < max) return false; //valid

    return true; //invalid
  },

  isEmail (email) {
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  },

  isDate (format) {
    // Aprroved format: yyyy-mm-dd
    const pattern = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

    if(pattern.test(format)) return true;

    return false;
  },

  getTrainerId (userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject(404);

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) return reject(404);

          return resolve(_trainer.id);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  prepareData (data, permission, nameOfModel) {
    return new Promise(function (resolve, reject) {
      const pattern = patterns[nameOfModel];
      const listToOmit = [];

      async.forEach(Object.keys(pattern), function (attribute, next) {
        console.log(attribute, ' --- ',  pattern[attribute].permission, ':', permission, ' = ', pattern[attribute].permission < permission); // WARNING:  do not delete this
        if (data[attribute] === null || data[attribute] === undefined || pattern[attribute].permission < permission) {
          console.log('\x1b[41m%s\x1b[0m ', attribute); // WARNING:  do not delete this
          listToOmit.push(attribute);
        }

        if(typeof data[attribute] === 'string') data[attribute] = data[attribute].trim(); // remove whitespace
        next();
      }, function (err) {
        if(err) {
          sails.log.error(err);
          return reject();
        }
        return resolve(_.omit(data, listToOmit));
      });
    });
  }
};
