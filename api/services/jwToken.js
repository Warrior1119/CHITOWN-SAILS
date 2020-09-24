'use strict';
const jwt = require('jsonwebtoken');

module.exports = {
  // Generates a token from supplied payload
  issue (payload) {
    return jwt.sign(
      payload,
      sails.config.custom.jwtSecret // Token Secret that we sign it with
    );
  },

  // Verifies token on a request
  verify (token, callback) {
    return jwt.verify(
      token, // The token to be verified
      sails.config.custom.jwtSecret, // Same token we used to sign
      {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
      callback //Pass errors or decoded token to callback
    );
  }
};
