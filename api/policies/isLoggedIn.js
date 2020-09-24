'use strict';

module.exports = (req, res, next) => {
  let token;

  if (req.headers && req.headers.token) {
    token = req.headers.token;
    if (token.length <= 0) return res.error(403);

  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.error(401);
  }

  jwToken.verify(token, function (err, token) {
    if (err) return res.error(403);
    req.token = token; // This is the decrypted token or the payload you provided
    next();
  });
};
