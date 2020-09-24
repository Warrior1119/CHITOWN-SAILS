'use strict';
module.exports = function noContent () {
  const res = this.res;

  res.status(204);
  return res.jsonp('No content');
};
