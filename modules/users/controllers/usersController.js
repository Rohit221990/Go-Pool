'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  async = require('async'),
  users = require('./sources/usersSource'),
  errorHandler = require(path.resolve('./modules/core/controllers/error-controller'));

/**
 * Get users Data
 */
module.exports.getUsers = function (req, res, done) {
  async.waterfall([
    function (next) {
      // user - project (one to one)
      users.getUsers(req)
        .then(function(user) { next(null, user); }, function (err) { done(null, err); });
      },
        function(user, next) {
        var userData = {
          isLoggedIn: true,
          id: user._id,
          createTime: user.createdAt,
          email:user.email,
          firstName:user.firstName,
          lastName:user.lastName,
          updateTime:user.updatedAt,
          username:user.username,
          alternativeEmail: user.alternativeEmail,
          corporateEmail: user.corporateEmail,
          password: user.password,
          dob:user.date,
          gender:user.gender,
          mobileNumber:user.mobileNumber
        }
        res.send({ status: 'success', msg: 'users saved successfully', userData: userData, data: user});
    }
  ],function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send(errorHandler.getErrorResponse(err));
      // return done(err);
    }
  });
};

/**
 * Save users
 */
module.exports.saveUsers = function (req, res, done) {
  async.waterfall([
    function (next) {
      users.saveUsers(req, res)
        .then(function(user) { next(null, user); }, function(err) { done(null, err); });
    },
    function (user, next) {
      var userData = {
        isRegister: true,
        _id: user._id,
        _doc: user._doc,
        createTime: user.createdAt,
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
        updateTime:user.updatedAt,
        username:user.username,
        corporateEmail: user.corporateEmail,
        alternativeEmail: user.alternativeEmail,
        mobileNumber : user.mobileNumber,
        dob: user.dob,
        gender : user.gender
      }
      res.send({ status: 'success', msg: 'users saved successfully', userData: userData, data: user});
    }
  ], function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send(errorHandler.getErrorResponse(err));
      // return done(err);
    }
  });
};

/**
 * Save users
 */
module.exports.deleteUsers = function (req, res, done) {
  async.waterfall([
    function (next) {
      users.deleteUsers(req, res)
        .then(function(user) { next(null, user); }, function(err) { done(null, err); });
    },
    function (user, next) {
      res.send({ status: 'success', msg: 'users deleted successfully', data: user });
    }
  ], function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send(errorHandler.getErrorResponse(err));
      // return done(err);
    }
  });
};



