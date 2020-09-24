'use strict';

const crypto = require('crypto');

module.exports = {
  create (data) {
    return new Promise(function (resolve, reject) {
      Sku.findOne({ id: data.skuId })
        .then(_item => {
          if(!_item) return reject(404);

          return GiftCard.create({
            name: _item.name,
            skuId: _item.id,
            hash: crypto.randomBytes(10).toString('hex'),
            expDate: new Date().getTime() + (sails.config.custom.timestamps.month * 2),
            value: _item.cost
          }).meta({ fetch: true });
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
