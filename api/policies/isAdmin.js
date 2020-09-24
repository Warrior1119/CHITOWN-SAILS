'use strict';

module.exports = function isAdmin (req, res, next) {
  if(req.permission === 0) return next();

  return res.error(401);
};
