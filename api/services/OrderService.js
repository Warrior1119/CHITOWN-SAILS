'use strict';

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      let client;

      Sku.findOne({ id: data.skuId })
        .populateAll()
        .then(_item => {
          if(!_item) return reject(404);


          if(_item.productId.personal) {
            data.name = `${_item.productId.name} (${_item.duration} min)`;
          } else {
            data.name = _item.name;
          }

          data.quantity = _item.quantity;
          data.spent = _item.cost;
          data.paid = data.totalCost;
          data.productId = _item.productId.id;

          return Client.findOne({ id: data.clientId }).populateAll();
        })
        .then(_client => {
          if(!_client) return reject(404);

          client = _client; //expose client data

          if(_client.buildingId) data.buildingId = _client.buildingId.id;
          if(_client.trainerId) data.trainerId = _client.trainerId.id;
          return Order.create(data).meta({ fetch: true });
        })
        .then(_order => {
          InvoiceService.create({
            email: client.user.email,
            name: `${client.user.firstName} ${client.user.lastName}`,
            products: [
              // TODO: Consider to add quantity of bought product
              { name: _order.name, price: _order.paid }
            ]
          })
            .then((_invoice) => {
              resolve(_invoice.path)
            })
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  createCustom (data) {
    return new Promise((resolve, reject) => {
      let client;

      data.customEvent = true;
      data.quantity = 1;
      data.spent = data.cost; // calculate total spent
      data.paid = data.cost;

      Client.findOne({ id: data.clientId })
        .populateAll()
        .then(_client => {
          if(!_client) return reject(404);
          client = _client; //expose client data

          if(_client.buildingId) data.buildingId = _client.buildingId.id;
          if(_client.trainerId) data.trainerId = _client.trainerId.id;

          return Order.create(data).meta({ fetch: true });
        })
        .then(_order => {
          InvoiceService.create({
            email: client.user.email,
            name: `${client.user.firstName} ${client.user.firstName}`,
            products: [
              { name: _order.name, price: _order.paid }
            ]
          })
            .then(() => resolve(_order))
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject(err);
        });
    });
  },

  find (data) {
    return new Promise((resolve, reject) => {
      Order.find({
        where: { createdAt: { '>=': data.start, '<=': data.end } },
        sort: 'id DESC'
      })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
