'use strict';
module.exports = function created (data) {
  const res = this.res;
  const responseData = data || 'Created';

  res.status(201);
  return res.jsonp(responseData);
};
