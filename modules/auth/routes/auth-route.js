'use strict';

/**
 * Module dependencies.
 */
var Auth = require('../controllers/auth-controller');

module.exports = function (app) {
  // Authentication api routes
  app.route('/api/v1/auth/signin').post(Auth.signin);
  app.route('/api/v1/auth/signout').post(Auth.signout);

  // User Activation api routes
  app.route('/api/v1/auth/activate').post(Auth.sendActivate);
  app.route('/api/v1/auth/activate/:token').get(Auth.activate);
};
