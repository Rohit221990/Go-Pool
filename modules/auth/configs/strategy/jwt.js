'use strict';

/**
 * Module dependencies.
 */
require('../../../users/models/usersModel');

var passport = require('passport'),
  passportJWT = require('passport-jwt'),
  JwtStrategy = passportJWT.Strategy,
  ExtractJwt = passportJWT.ExtractJwt,
  UserModel = require('mongoose').model('Users');

/**
 * Verify the auth token in header is valid
 * @param config
 * @return user object
 */
module.exports = function (config) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.jwtSuperSecret || 'amQ,5z)9E24_)qG[FK,UkD*p@123';
  // opts.issuer = "accounts.matkraft.com";
  // opts.audience = "matkraft.com";

  passport.use('user-jwt', new JwtStrategy(opts, function (jwt_payload, done) {
    UserModel.findById(jwt_payload.id)
      .then(function (user) {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      }, function (err) {
        return done(err, false);
      });
  }));

};
