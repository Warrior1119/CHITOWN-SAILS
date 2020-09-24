'use strict';
const SailsFactory = require('sails/lib/app');
const winston = require('winston');
const testLogger = new winston.Logger();
let sailsInstance;

testLogger.add(winston.transports.Console, {
  level: 'warn',
  colorize: true
});


beforeEach( function(done) {
  this.timeout(600000);

  // Create Sails instance.
  sailsInstance = new SailsFactory();

  sailsInstance.lift( {
    datastores: {
      default: {
        adapter: require('sails-mysql'),
        url: 'mysql://root:12qwaszx@mysql:3306/chitown-test'
      }
    },

    models: {
      migrate: 'drop'
    }
  }, function(err) {
    if (err)
      return done(err);

    return done();
  } );
} );

afterEach(function(done) {
  console.log('\x1b[33m%s\x1b[0m ','Start lowering the Sails...');
  return sailsInstance.lower(done);
} );
