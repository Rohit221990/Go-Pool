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
  if (_.get(req, 'params.id')) {
    query = { id: req.params.id };
  }
  return new Promise(function (resolve, reject) {
    if (req.params.id) {
      userModel.find(query).exec()
        .then(function (user) {
          logInConsole('User has fetched successfully', 'success');
          resolve(user);
        }, function (err) {
          logInConsole('User has not fetched successfully because of : '+ err, 'fail');
          reject(err);
        });
    } else {
      userModel.find(query).exec()
        .then(function (users) {
          logInConsole('User has fetched successfully', 'success');
          resolve(users);
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
      userModel.update({id : req.body.id},body, function(err, raw){
        if(err){
          logInConsole('User has not updated successfully because of : '+ err, 'fail');
          reject(err);
        }else{
          var userObj = new userModel(body);
          userObj.save()
          .then(function(user){
            logInConsole('User has created successfully', 'success');
            resolve(user); 
          })
        }
      })
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

