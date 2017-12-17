'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Users Schema
 */
var userSchema = new Schema({
  id: { type: String },
  firstName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the users name'
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the users name'
  },
  email: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the users name'
  },
  password: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the users name'
  }
  // },
  // address: {
  //   type: String,
  //   trim: true,
  //   default: ''
  // }
}, { strict: false });

module.exports = userSchema;
