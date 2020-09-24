'use strict';

module.exports = function isTrainer (req, res, next) {
  if(req.permission <= 2) return next();

  return res.error(401);
};
