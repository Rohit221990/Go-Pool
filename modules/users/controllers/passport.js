'use strict';

/**
 * Module dependencies.
 */
require('../models/usersSchema');

var passport = require('passport').Strategy,
  passportJWT = require('passport-jwt').ExtractJwt,
  JwtStrategy = passportJWT.Strategy,
  ExtractJwt = passportJWT.ExtractJwt,
  UserModel =  mongoose.model('Users')

/**
 * Verify the auth token in header is valid
 * @param config
 * @return user object
 */
module.exports = function (config) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = 'amQ,5z)9E24_)qG[FK,UkD*p@123';
  // opts.issuer = "accounts.matkraft.com";
  // opts.audience = "matkraft.com";

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    UserModel.findById(jwt_payload._doc._id)
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
