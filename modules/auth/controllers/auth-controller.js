'use strict';

/**
 * Module dependencies.
 */
require('../../users/models/usersModel');

var path = require('path'),
  jwt = require('jsonwebtoken'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('Users'),
  AuthEvent = require('../events/auth-event'),
  config = require(path.resolve('./config/appconfig')),
  // MailEvent = require(path.resolve('./modules/message/events/mail-event')),
  ErrorHandler = require(path.resolve('./modules/core/controllers/error-controller'));

/**
 * Signin after passport authentication
 */
module.exports.signin = function (req, res, next) {
  passport.authenticate('user-local', { 'session': false }, function (err, user) {
    if (err) {
      return res.status(400).send(ErrorHandler.getErrorResponse(err));
    } else {
      if (!user) {
        err = new Error('Invalid credentials, try again');
        return res.status(400).send(ErrorHandler.getErrorResponse(err));
      }
      // send user object in request
      req.user = { id: user.id };

      if (user.lastLoginAt === undefined) {
        user.lastLoginAt = new Date();
        req.newUser = true; // custom field
      } else {
        user.lastLoginAt = new Date();
        req.newUser = false; // custom field
      }

      // update the last login time
      UserModel.update({ _id: user._id }, { $set: user })
        .then(function(updateUser) {
          // Remove sensitive data before response
          user.password = undefined;
          user.salt = undefined;
          user.activateToken = undefined;
          user.activateTokenExpires = undefined;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          // generate jwt token
          req.token = jwt.sign(req.user, req.app.get('superSecret'), {
            expiresIn: config.jwtExpire // expires in 168 hours (7 days)
          });

          // log the activity
          AuthEvent.emit('authSignin', user);
          // success response
          return res.status(200).json({
            result: 'success',
            message: 'User loggedin successfully',
            newUser: req.newUser,
            token: req.token,
            userData: user
          });
        }, function(err) {
          return res.status(400).send(ErrorHandler.getErrorResponse(err));
        });
    }
  })(req, res, next);
};

/**
 * Signout
 */
module.exports.signout = function (req, res) {
  req.logout();
  res.send({
    result: 'success',
    message: 'User logged out successfully'
  });
};

/**
 * Activate (user email verification)
 */
module.exports.activate = function(req, res, next) {
  // validate active token
  UserModel.findOne({
    activateToken: req.params.token,
    activateTokenExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if(err || !user) {
      if(!err) {
        err = new Error('Active token is invalid or expired, please try again (activation link)');
      }
      return res.status(400).send(ErrorHandler.getErrorResponse(err));
    }
    // update user activate data
    user.activateToken = undefined;
    user.activateTokenExpires = undefined;
    user.activeFlag = true;

    // update the new user object
    UserModel.update({ _id: user._id }, { $set: user })
      .then(function(userObj) {
        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;

        // log the activity
        AuthEvent.emit('authActivate', user);
        // success response
        res.json({
          result: 'success',
          message: 'User activated successfully',
          data: user
        });
      }, function(err) {
        return res.status(400).send(ErrorHandler.getErrorResponse(err));
      });
  });
};

/**
 * Send Activate Link
 */
module.exports.sendActivate = function(req, res, next) {
  // validate active token
  UserModel.findOne({
    email: req.body.email
  }, function(err, user) {
    if(err || !user) {
      if(!err) err = new Error('Email not found');
      return res.status(400).send(ErrorHandler.getErrorResponse(err));
    }

    if(user.activeFlag) {
      err = new Error('User already active, Please login');
      return res.status(400).send(ErrorHandler.getErrorResponse(err));
    }
    // remove activateToken will reset in user model
    user.activateToken = undefined;

    // update the new user object
    UserModel.update({ _id: user._id }, { $set: user })
      .then(function(userObj) {
        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;

        // send out activation mail to registered user email
        var activateUrl = config.domain.url + '/api/' + config.domain.version + '/auth/activate/' + user.activateToken;
        var mailOptions = {
          to: user.email,
          subject: 'Matkraft - User activation mail',
          html: '<h2>User activation email<h2> <a href="'+activateUrl+'">'+ activateUrl +'</a>'
        };
        // mailevent to sent email
        // MailEvent.emit('sendEmail', mailOptions);

        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;
        user.activateToken = undefined;
        // log the activity
        AuthEvent.emit('authActivateLink', user);
        // success response
        res.json({
          result: 'success',
          message: 'User activation link sent to registered email',
          data: user
        });
      }, function(err) {
        return res.status(400).send(ErrorHandler.getErrorResponse(err));
      });
  });
};
