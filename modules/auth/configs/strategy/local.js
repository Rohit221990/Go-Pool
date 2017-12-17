'use strict';

/**
 * Module dependencies.
 */
require('../../../users/models/usersModel');

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  UserModel = require('mongoose').model('Users');

module.exports = function () {
  // Use local strategy
  passport.use('user-local', new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  }, function (usernameOrEmail, password, done) {
    UserModel.findOne({
      $or:[ { email: usernameOrEmail }, { username: usernameOrEmail } ]
    })
    .populate({
      path: '_roleId', model: 'Role', select: ['name', 'access'],
      populate: { path: 'access._featureId', model: 'Feature', select: ['name'] }
    })
    .then(function (user) {
      // check user password is valid
      if (!user || !user.authenticate(password)) {
        return done(new Error('Invalid username or password'), false);
      }
      // check user is active
      if(user.activeFlag !== true) {
        var tokenUrl;
        if (process.env.NODE_ENV === 'development') {
          tokenUrl = ' Dev activate url \n\n http://localhost:5000/api/v1/auth/activate/'+user.activateToken;
        }
        return done(new Error('User not active, please check your registered email to activate' + tokenUrl), false);
      }
      if(user.deleteFlag) {
        return done(new Error('Cannot login, please contact admin for more details'), false);
      }

      return done(null, user);
    }, function (err) {
      // return the error
      return done(err);
    });
  }));

};
