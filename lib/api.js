/*
 * node-thrust: api.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-10-21 spolu  Codacy fixes
 * - 2014-10-09 spolu  Creation
 * - 2014-10-10 spolu  Event support
 */
"use strict"

var common = require('./common.js');

var events = require('events');


// ## api
// 
// Object in charge of RPC with the wrapper process as well as exposing the
// api components.
//
// ```
// @spec { process }
// @inherits events.EventEmitter
// ```
var api = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  my.process = spec.process;

  my.BOUNDARY = '--(Foo)++__THRUST_SHELL_BOUNDARY__++(Bar)--';
  my.ACTION_TIMEOUT = 500;
  my.action_id = 0;

  my.actions = {};
  my.objects = {}
  my.acc = '';

  //
  // #### _public_
  //
  var init;                 /* init(cb_); */

  //
  // #### _protected_
  //
  var action_id;            /* action_id(); */
  var perform;              /* peform(action, cb_); */
  var register;             /* register(object); */
  var unregister;           /* unregister(object); */

  //
  // #### _private_
  //
  var stdout_handler;  /* stdout_handler(data); */
  
  //
  // #### _that_
  //
  var that = new events.EventEmitter();

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/
  // ### stdout_handler
  //
  // Handles data coming from the shell to the client library
  // ```
  // @chunk {Buffer} the incoming chunk
  // ```
  stdout_handler = function(chunk) {
    my.acc += chunk;
    var splits = my.acc.split(my.BOUNDARY);
    while(splits.length > 1) {
      var data = splits.shift();
      my.acc = splits.join(my.BOUNDARY);
      if(data && data.length > 0) {
        try {
          var action = JSON.parse(data);
          if(action._action === 'reply' && 
             my.actions[action._id.toString()]) {
            /* my.actions is cleaned up by calling the callback. */
            var cb_ = my.actions[action._id.toString()];
            if(action._error) {
              cb_(common.err(action._error,
                             'thrust:shell_error'));
            }
            cb_(null, action._result);
          }
          else if(action._action === 'event' && 
                  my.objects[action._target.toString()]) {
            my.objects[action._target.toString()].emit(action._type, 
                                                       action._event);
          }
          else if(action._action === 'invoke' &&
                  my.objects[action._target.toString()]) {
            (function(id) {
              my.objects[action._target.toString()].invoke(action._method, 
                                                           action._args, 
                                                           function(err, res) {
                perform({
                  _id: id,
                  _action: 'reply',
                  _error: err ? err.message : '',
                  _result: res
                });
              });
            }(action._id));
          }
          else {
            /* Log unhandled actions. Exception is catched below. */
            throw common.err('Unhandled action: ' + action._action,
                             'thrust:unhandled_action');
          }
        }
        catch(err) {
          common.log.error(err);
          common.log.out('=========================================');
          common.log.out(data);
          common.log.out('=========================================');
        }
      }
    }
  };

  /****************************************************************************/
  /* PROTECTED HELPERS */
  /****************************************************************************/
  // ### action_id
  //
  // Returns the next action_id
  action_id = function() {
    return ++my.action_id;
  };

  // ### perform
  //
  // Performs an action by sending it over the network. If the callback is
  // specified, it stores the callback for later execution on action response.
  // ```
  // @action {object} a valid action object
  // @cb_    {function(err, res)}
  // ```
  perform = function(action, cb_) {
    if(cb_) {
      /*
      var itv = setTimeout(function() {
        delete my.actions[action._id.toString()];
        return cb_(common.err('Action timed out: ' + action._id,
                              'thrust:action_timeout'));
      }, my.ACTION_TIMEOUT);
      */
      my.actions[action._id.toString()] = function(err, res) {
        delete my.actions[action._id.toString()];
        //clearTimeout(itv);
        return cb_(err, res);
      };
    }
    my.process.stdin.write(JSON.stringify(action) + '\n' + my.BOUNDARY + '\n');
  };

  // ### register
  //
  // Registers an api object to the API for invocation and event emition
  // ```
  // @object {object} api.base object
  // ```
  register = function(object) {
    my.objects[object.target().toString()] = object;
  };

  // ### unregister
  //
  // Unregisters an api object from the API
  // ```
  // @object {object} api.base object
  // ```
  unregister = function(object) {
    delete my.objects[object.target().toString()];
  };

  /****************************************************************************/
  /* PUBLIC METHODS */
  /****************************************************************************/
  // ### init
  //
  // Initializes the API and opens the JSON RPC channel
  // ```
  // @cb_ {function(err, api)}
  // ```
  init = function(cb_) {
    that.session = function(args) {
      return require('./api.session.js').session({ api: that, args: args });
    };
    that.window = function(args) {
      return require('./api.window.js').window({ api: that, args: args });
    };
    that.menu = function(args) {
      return require('./api.menu.js').menu({ api: that, args: args });
    };

    my.process.stdout.on('data', stdout_handler);

    return cb_(null, that);
  };

  common.method(that, 'action_id', action_id, _super);
  common.method(that, 'perform', perform, _super);
  common.method(that, 'register', register, _super);
  common.method(that, 'unregister', unregister, _super);

  common.method(that, 'init', init, _super);

  return that;
}

exports.api = api;
