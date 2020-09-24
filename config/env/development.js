'use strict';

// Require our custom logger.
const winston = require('winston');
require('winston-daily-rotate-file');

module.exports = {

  blueprints: {
    shortcuts: false,
    actions: false,
    rest: false
  },

  custom: {
    // Define JWT's secret.
    jwtSecret: process.env.JWT_SECRET,
    // Define Mail's configuration.
    mail: {
      from: process.env.MAIL_FROM,
      smtp: {
        host: process.env.MAIL_SMTP_HOST,
        port: process.env.MAIL_SMTP_PORT,
        login: process.env.MAIL_SMTP_LOGIN,
        password: process.env.MAIL_SMTP_PASSWORD
      },
      activate: process.env.MAIL_ACTIVATE,
      password: process.env.MAIL_PASSWORD
    },
    // Define Redis's configuration.
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    },
    // Define Stripe's configuration.
    stripe: {
      apiKey: process.env.STRIPE_API_KEY,
      apiVer: process.env.STRIPE_API_VER
    },
    // Define timestamps.
    timestamps: {
      tenMinutes: 10 * 60 * 1000,
      thirtyMinutes: 30 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 24 * 7 * 60 * 60 * 1000,
      month: 24 * 31 * 60 * 60 * 1000,
      year: 24 * 365 * 60 * 60 * 1000
    }
  },

  datastores: {
    default: {
      // Configure adapter.
      adapter: require('sails-mysql'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DB
    }
  },

  hooks: {
    grunt: false,
    session: false,
    sockets: false,
    pubsub: false
  },

  http: {},

  log: {
    level: 'debug',
    inspect: false,
    custom: new winston.Logger({
      transports: [
        new (winston.transports.Console)({
          level: 'debug',
          json: false,
          colorize: true
        })
      ]
    })
  },

  logDelete: new winston.Logger({
    transports: [
      new winston.transports.DailyRotateFile({
        level: 'warn',
        filename: './logs/delete.log',
        json: false,
        colorize: false,
        datePattern: 'yyyy-MM-dd.',
        prepend: true
      })
    ]
  }),

  models: {
    migrate: 'safe'
  },

  security: {
    // Cross-Origin Resource Sharing.
    cors: {
      allRoutes: true,
      allowOrigins:'*',
      allowCredentials: false,
      allowRequestHeaders: 'content-type,token'
    },

    // Cross-Site Request Forgery.
    csrf: false
  },

  session: {
    secret: process.env.SESSION_SECRET
  }

};
