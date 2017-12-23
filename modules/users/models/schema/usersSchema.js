'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Users Schema
 */
var userSchema = new Schema({
  id: { type: Number },
  firstName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the first name'
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the last name'
  },
  email: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the email'
  },
  password: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the password'
  },
  username: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the username'
  }
  // },
  // address: {
  //   type: String,
  //   trim: true,
  //   default: ''
  // }
}, { strict: false });

module.exports = userSchema;
