'use strict';

/**
 * Module dependencies.
 */

require('../../models/usersModel');

var _ = require('lodash'),
  Promise = require('bluebird'),
  mongoose = require('mongoose'),
  async = require('async'),
  userModel = mongoose.model('Users'),
  chalk = require('chalk'),
  bcrypt = require('bcrypt')


/**
 * Get Users details
 * @param: id (int|all) category id or all
 * @return: category (array | object)
 */
exports.getUsers = function (req) {
  logInConsole('Calling for getting users');
  var query = {};
  if (_.get(req, 'query.id')) {
    query = { id: req.query.id };
  }
  return new Promise(function (resolve, reject) {
    if (req.query.id) {
      userModel.findById(query.id).exec()
      .then(function (users) {
        logInConsole('User has fetched successfully', 'success');
        resolve(users);
      }, function (err) {
         logInConsole('User has not fetched successfully because of : '+ err, 'fail');
        reject(err);
      });
    } else {
      userModel.find(query).exec()
      .then(function (user) {
        logInConsole('User has fetched successfully', 'success');
        resolve(user);
      }, function (err) {
        logInConsole('User has not fetched successfully because of : '+ err, 'fail');
        reject(err);
      });
    }
  });
};
/**
 * Save users details
 * @param: req (object) request object with params & data
 * @return: users (array | object)
 */
exports.saveUsers = function (req, res) {

  logInConsole('Calling for updating users');
  
  return new Promise(function(resolve, reject) {
   var body = _.get(req, 'body')
    if (_.get(body, 'id')) {
        userModel.findById(req.body.id, function(err, p){
        if(err){
          reject(err)
        }
        else{
          p.corporateEmail = body.corporateEmail;
          p.alternativeEmail = body.alternativeEmail;
          p.mobileNumber = body.mobileNumber;
          p.date = body.date;
          p.gender = body.gender;
          var userObj = new userModel(p);
          userObj.save()
            .then(function(user) { 
              logInConsole('User has created successfully', 'success');
              resolve(user); 
            }, function(err) { 
              logInConsole('User has not created successfully because of : '+ err, 'fail');
              reject(err); 
            });
          }
        });
    } 
    else  {
      userModel.findOne({ 
          $or:[ { email: body.email }, { username: body.username }]
      })
      .then((err, item) => {
        if(err){
          return reject(err);
        }
      else{
        var userData = req.body;
        bcrypt.hash(userData.password, 10, function (err, hash){
          if (err) {
            return next(err);
          }
          userData.password = hash;
          var userObj = new userModel(userData);
          userObj.save()
            .then(function(user) { 
              logInConsole('User has created successfully', 'success');
              resolve(user); 
            }, function(err) { 
              logInConsole('User has not created successfully because of : '+ err, 'fail');
              reject(err); 
            });
          })
        }
      })
    }
  })
};

exports.deleteUsers = function (req, res) {

  logInConsole('Calling for deleting users');
  
  return new Promise(function(resolve, reject) {

    if (_.get(req, 'params.id')) {
      userModel.remove({id : req.params.id}).exec()
        .then(function(user) {
          logInConsole('User has deleted successfully', 'success');
          resolve(user); 
        }, function(err) { 
          logInConsole('User has not deleted successfully because of : '+ err, 'fail');
            reject(err); 
        });
    }
  });
};


function logInConsole(msg, type) {
  switch(type){
    case 'success':
      console.log(chalk.green(msg));
      break;
    case 'fail':
      console.log(chalk.red(msg));
      break;
    default:
      console.log(msg);
  }
}

