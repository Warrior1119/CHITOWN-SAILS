'use strict';
const pdf = require('html-pdf');
const JSDOM = require('jsdom').JSDOM;
const fs = require('fs');
const crypto = require('crypto');

function prepareProductsList (products) {
  let template = '';

  for (var i = 0; i < products.length; i++) {
    if(i === products.length - 1) {
      template += '<tr class="item last"> <td>' + products[i].name + '</td> <td> $' + products[i].price + ' </td> </tr>';
    } else {
      template += '<tr class="item"> <td>' + products[i].name + '</td> <td> $' + products[i].price + ' </td> </tr>';
    }
  }

  return template;
}

function prepareTemplate (data) {
  return new Promise((resolve, reject) => {
    fs.readFile('./config/templates/invoice.html', 'utf8', (err, file) => {
      if(err) {
        sails.log.error(err);
        return reject();
      }
      let window = (new JSDOM(file)).window;

      window.document.querySelector('[name=invoice-id]').innerHTML = data.invoiceId;
      window.document.querySelector('[name=created]').innerHTML = new Date().toLocaleDateString();

      window.document.querySelector('[name=client-company]').innerHTML = data.company || '';
      window.document.querySelector('[name=client-name]').innerHTML = data.name;
      window.document.querySelector('[name=client-email]').innerHTML = data.email;

      window.document.getElementsByClassName('heading')[0].insertAdjacentHTML('afterend', prepareProductsList(data.products));

      window.document.querySelector('[name=total-price]').innerHTML = data.products.reduce((prev, curr) => ({ price: prev.price + curr.price })).price;

      return resolve(window.document.documentElement.outerHTML);
    });
  });
}

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      Invoice.count()
        .then(invoicesQuantati => {
          data.invoiceId = invoicesQuantati + 1;

          prepareTemplate(data)
            .then(file => {


              const hash = crypto.randomBytes(20).toString('hex');

              pdf.create(file).toFile('./opt/invoices/' + data.email + '_' + hash + '.pdf', function (err, file) {
                if(err) {
                  sails.log.error(err);
                  return reject();
                }

                var packageName = '', totalPrice = 0;
                if (data.products && data.products.length > 0) {
                  data.products.forEach(element => {
                    packageName = element.name;
                    totalPrice += element.price;
                  });
                }
                Invoice.create({
                  fileName: `${crypto.randomBytes(16).toString('hex')}`,
                  path: file.filename,
                  user: data.email,
                  packageName: packageName,
                  totalPrice: totalPrice
                })
                  .meta({ fetch: true })
                  .then(resolve)
                  .catch(err => {
                    sails.log.error(err);
                    return reject();
                  });
              });
            })
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOne (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Invoice.findOne({ user: _user.email, fileName: data.fileName });
        })
        .then(_invoice => {
          if(!_invoice) return reject(404);

          return resolve(_invoice);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find (userID) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userID })
        .then(_user => {
          if(!_user) return reject(404);

          return Invoice.find({ user: _user.email });
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
