'use strict';

module.exports = function isManager (req, res, next) {
  if(req.permission <= 1) return next();

  return res.error(401);
};
