'use strict';

/**
 * Module dependencies.
 */
require('../../../users/models/usersModel');

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  UserModel = require('mongoose').model('Users'),
  bcrypt  = require('bcrypt-nodejs')

module.exports = function () {
  // Use local strategy
  passport.use('user-local', new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  }, function (usernameOrEmail, password, done) {
    UserModel.findOne({
      $or:[ { email: usernameOrEmail }, { username: usernameOrEmail } ]
    })
    .then(function (user) {
      if(!user){
        return done(new Error('Invalid username or password'), false);        
      }
      // check user password is valid
      if (user) {
        bcrypt.compare(password, user.password, function (err, result){
          if(!result){
            return done(new Error('Invalid username or password'), false);
          }  
          return done(null, user);               
        })
      }
      // check user is active
      // if(user.activeFlag !== true) {
      //   var tokenUrl;
      //   if (process.env.NODE_ENV === 'development') {
      //     tokenUrl = ' Dev activate url \n\n http://localhost:5000/api/v1/auth/activate/'+user.activateToken;
      //   }
      //   return done(new Error('User not active, please check your registered email to activate' + tokenUrl), false);
      // }
      // if(user.deleteFlag) {
      //   return done(new Error('Cannot login, please contact admin for more details'), false);
      // }
    }, function (err) {
      // return the error
      return done(err);
    });
  }));
  function authenticate(password, user){

  }
};


