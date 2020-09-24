'use strict';

function sumProfitByDay (data) {
  data = _.groupBy(data, x => Utilities.getStartOfDay(x.createdAt));

  for (const day in data) {
    let saldo = 0;
    for (let order of data[day])
      saldo += order.paid;

    data[day] = saldo;
  }

  return data;
}

function buildTable (orders) {
  return new Promise((resolve, reject) => {
    const table = [];

    async.each(orders, (order, next) => {
      User.findOne({ email: order.clientId.user })
        .then(_user => {
          table.push({
            clientName: `${_user.firstName} ${_user.lastName}`,
            serviceName: order.productId ? order.productId.name : 'Training',
            servicePrice: order.spent,
            quantity: order.quantity,
            totalSpent: order.spent,
            discount: order.discount,
            totalPaid: order.paid
          });
          next();
        })
        .catch(err => next(err));
    }, err => {
      if(err) {
        sails.log.error(err);
        return reject();
      }

      return resolve(table);
    });
  });
}


module.exports = {
  analyze (data) {
    return new Promise((resolve, reject) => {
      const criteria = {
        where: {
          name: data.type,
          trainerId: data.trainerId,
          buildingId: data.buildingId,
        },
        sort: 'id ASC'
      };

      criteria.where = Utilities.cleanProps(criteria.where);
      criteria.where.createdAt = { '>=': data.start, '<=': data.end };

      Order.find(criteria)
        .populateAll()
        .then(_orders => {
          const result = sumProfitByDay(_orders);
          buildTable(_orders)
            .then(_table => resolve({ graph: result, table: _table }))
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
