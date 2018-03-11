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
  },
  corporateEmail:{
    type: String,
    trim: true
  },
  alternativeEmail:{
    type: String,
    trim: true
  },
  mobileNumber:{
    type: String,
    trim: true
  },
  dob:  { type: String },
  gender:{
    type: String,
    trim: true
  },
    registration: {
    type: Boolean,
    trim: true
  },
  imagePath:{
    type: String,
    trim: true
  }

}, { strict: false });

module.exports = userSchema;
