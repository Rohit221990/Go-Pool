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
  },
  name:{
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the name'
  },
  corporateEmail:{
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the corporateEmail'
  },
  alternativeEmail:{
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the alternativeEmail'
  },
  mobileNumber:{
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the mobileNumber'
  },
  dob: { 
    type: Date, 
    default: Date.now ,
    required: 'Please fill the dob'
  },
  gender:{
    type: String,
    trim: true,
    default: '',
    required: 'Please fill the gender'
  }

}, { strict: false });

module.exports = userSchema;
