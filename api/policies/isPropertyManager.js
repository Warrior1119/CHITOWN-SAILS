'use strict';

module.exports = function (req, res, next) {
  if(req.permission <= 3) return next();

  return res.error(401);
};
