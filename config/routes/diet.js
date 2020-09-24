'use strict';

module.exports.routes = {
  'POST /diet': 'diet/create',
  'POST /diet/add': 'diet/add-diet',
  'GET /diet': 'diet/find',
  'GET /diet/:clientId': 'diet/find',
};
