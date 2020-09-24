'use strict';

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      ShopItem.findOne({ id: data.productId })
        .then(_item => {
          if(!_item) return reject({ errCode: 404 ,message: 'Product not found' });

          return Sku.create(data).meta({ fetch: true });
        })
        .then(_sku => {
          return Sku.findOne({ id: _sku.id }).populateAll();
        })
        .then(_sku => {
          if(_sku.productId.color && _sku.productId.icon && _sku.productId.category !== 'Nutrition Services') {
            TrainingType.findOrCreate({
              name: `${_sku.productId.name} ${_sku.duration} min`
            },{
              name: `${_sku.productId.name} ${_sku.duration} min`,
              duration: _sku.duration,
              icon: _sku.productId.icon,
              color: _sku.productId.color,
              personal: _sku.productId.personal,
              active: _sku.productId.active
            })
              .then(() => resolve(_sku))
              .catch(reject);

          } else {
            return resolve(_sku);
          }
        })
        .catch(reject);
    });
  },

  update (data) {
    return new Promise((resolve, reject) => {
      Sku.findOne({ id: data.id })
        .populateAll()
        .then(_sku => {
          if(!_sku) return reject({ errCode: 404 ,message: 'Sku not found' });

          return TrainingType.update({ name: `${_sku.productId.name} ${_sku.duration} min` })
            .set({
              name: data.duration ? `${_sku.productId.name} ${data.duration} min` : `${_sku.productId.name} ${_sku.duration} min`,
              duration: data.duration || _sku.duration
            });
        })
        .then(() => {
          return Sku.update({ id: data.id }).set(data).meta({ fetch: true });
        })
        .then(_skus => resolve(_skus[0]))
        .catch(reject);
    });
  },

  destroy (id) {
    return new Promise((resolve, reject) => {
      Sku.findOne({ id: id })
        .then(_sku => {
          if(!_sku) return reject(404);

          return Sku.destroy({ id: id });
        })
        .then(resolve)
        .catch(reject);
    });
  }
};
