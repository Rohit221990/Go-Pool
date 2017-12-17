'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  config = require(path.resolve('./config/appconfig'));

/**
 * Module init function.
 */
module.exports = function (app) {
  // Add passport's middleware
  app.use(passport.initialize());
  // app.use(passport.session());

  // Initialize oAuth strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategy/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

};
