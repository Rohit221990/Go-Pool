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
  var findByEmail = {};
  if (_.get(req, 'query.username')) {
    findByEmail = {email: req.query.username };
  }
  return new Promise(function (resolve, reject) {
    if (req.query.username) {
      userModel.find(findByEmail).exec()        
      .then(function (user) {
        bcrypt.hash(req.query.password,10, function (err, hash){
          if (err) {
            reject(err);
          }
          logInConsole(hash)
          bcrypt.compare(req.query.password, hash, function(err, res){
            if (res === true) {
              logInConsole('User has fetched successfully', 'success');
              resolve(_.first(user));
            } else {
              reject(err);
            }
          })
        })
      }, function (err) {
         logInConsole('User has not fetched successfully because of : '+ err, 'fail');
        reject(err);
      });
    }
    else{
        reject('User has not fetched successfully');
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
          p.dob = body.date;
          p.gender = body.gender;
          p.registration = true;
          p.imagePath = body.imagePath
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
      // userModel.update({id : req.body.id},body,{upsert:true,safe:true}, function(err, raw){
      //   if(err){
      //     reject(err);
      //   }else{
      //     resolve(raw);
      //   }
      // })
     
    else  {
      userModel.findOne({ 
          $or:[ { email: body.email }, { username: body.username }]
      })
      .then((err, item) => {
        if(err){
          return reject(err);
        }
      else{
        var userData =  req.body;
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

