'use strict';

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
class Validator {
  constructor (nameOfModel) {
    this.pattern = patterns[nameOfModel];
    return this;
  }

  valid (data, isUpdate) {
    return new Promise((resolve, reject) => {

      for (var key in this.pattern) { //through the pattern
        if(isUpdate) {
          if(data.id) if(isNaN(data.id) || !_.isFinite(Number(data.id))) return reject(400);

          if(!this._checkType(this.pattern[key], data[key], isUpdate)) return reject(400); // ...then check if attribute in data exist and match type
        } else { //if attribute is reqiered or if is not update
          if(!this._checkType(this.pattern[key], data[key]))return reject(400);  // ...then check if attribute in data exist and match type
        }
      }
      return resolve();
    });
  }

  _checkType (pattern, target, isUpdate) {
    if(target) {
      if(Object.prototype.hasOwnProperty.call(pattern, 'pattern')) {
        if(!pattern.pattern.test(target)) {
          return false;
        }
      }

      if(pattern.type !== typeof target) {
        return this._convertAndMatch(pattern, target);
      }

      return true; //valid
    }


    if(isUpdate) return true;
    return !pattern.required; //invalid, missing attribute
  }

  _convertAndMatch (pattern, target) {
    switch (pattern.type) {
      case 'number':
        return !isNaN(target); // if NaN return false which mean data is valid
        break;
      case 'array':
        if(Array.isArray(target)) {
          return this._checkSubType(pattern.subType, target);
        }
        return false; // invalid
        break;
      case 'file':
        if(!target._files.length && !target.fieldName.includes('avatar')) return false; // invalid
        return true; // valid
        break;
      case 'boolean':
        if(target === 'true' || target === 'false') return true;
        return false;
        break;
      case 'email': {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
        return regex.test(target);
        break;
      }
      default:
        throw Error('Can\'t recongize type');
    }
  }

  _checkSubType (subType, data) {
    switch (subType) {
      case 'number':
        for (let item of data) {
          if(isNaN(item)) return false; // invalid
        }
        return true;
        break;
      default:
        return true;
    }
  }
}

module.exports = {
  valid (data, nameOfModel, isUpdate) {
    return new Promise((resolve, reject) => {
      const validateData = new Validator(nameOfModel);
      validateData.valid(data, isUpdate)
        .then(resolve)
        .catch(reject);
    });
  },

  isNumber (data) {
    return new Promise((resolve, reject) => {
      async.each(data, (item, next) => {
        if(isNaN(item)) return reject(400);

        next();
      }, function (err) {
        if(err) {
          sails.log.error(err);
          return reject(400);
        }
        return resolve();
      });
    });
  }
};
