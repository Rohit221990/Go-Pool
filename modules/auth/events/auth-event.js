'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  Events = require('events')
  // ActivityEvent = require(path.resolve('./modules/message/events/activity-event'));

/**
 * Create new AuthEvent
 */
var AuthEvent = new Events.EventEmitter();

/**
 * Auth sign-in event
 */
AuthEvent.on('authSignin', function (user) {
  // activity data
  var activity = {
    _organisationId: user._organisationId,
    _userId: user._id,
    feature: 'Auth',
    action: 'Signin',
    _actionId: user._id,
    activity: 'User loggedin successfully',
    _createdBy: user._id
  };
  // emit the save activity event
  // ActivityEvent.emit('saveActivity', activity);
});

/**
 * Auth user activate event
 */
AuthEvent.on('authActivate', function (user) {
  // activity data
  var activity = {
    _organisationId: user._organisationId,
    _userId: user._id,
    feature: 'Auth',
    action: 'Activate',
    _actionId: user._id,
    activity: 'User activated successfully',
    _createdBy: user._id
  };
  // emit the save activity event
  // ActivityEvent.emit('saveActivity', activity);
});

/**
 * Auth user activate link
 */
AuthEvent.on('authActivateLink', function (user) {
  // activity data
  var activity = {
    _organisationId: user._organisationId,
    _userId: user._id,
    feature: 'Auth',
    action: 'ActivateLink',
    _actionId: user._id,
    activity: 'User activation link sent to registered email',
    _createdBy: user._id
  };
  // emit the save activity event
  // ActivityEvent.emit('saveActivity', activity);
});

module.exports = AuthEvent;
