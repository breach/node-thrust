/*
 * node-thrust: api.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-10-09 spolu  Creation
 * - 2014-10-10 spolu  Event support
 */
"use strict"

var common = require('./common.js');

var async = require('async');
var path = require('path');
var os = require('os');
var net = require('net');
var events = require('events');


// ## api
// 
// Object in charge of RPC with the wrapper process as well as exposing the
// api components.
//
// ```
// @spec {}
// @inherits events.EventEmitter
// ```
var api = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  my.salt = Date.now().toString();
  my.next_id = 0;

  my.BOUNDARY = "--(Foo)++__THRUST_SHELL_BOUNDARY__++(Bar)--";
  my.ACTION_TIMEOUT = 500;
  my.action_id = 0;

  my.client = null;
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
  var uid;                  /* uid(); */
  var action_id;            /* action_id(); */
  var perform;              /* peform(action, cb_); */
  var register;             /* register(object); */
  var unregister;           /* unregister(object); */

  //
  // #### _private_
  //
  var client_data_handler;  /* client_data_handler(data); */
  
  //
  // #### _that_
  //
  var that = new events.EventEmitter();

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/
  // ### client_data_handler
  //
  // Handles data coming from the client to the shell
  // ```
  // @chunk {Buffer} the incoming chunk
  // ```
  client_data_handler = function(chunk) {
    my.acc += chunk;
    var splits = my.acc.split(my.BOUNDARY);
    while(splits.length > 1) {
      var data = splits.shift();
      my.acc = splits.join(my.BOUNDARY);
      //console.log(splits);
      //console.log('DATA: ' + data + ' ' + data.length);
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
            my.objects[action._target.toString()].invoke(action._method, 
                                                         action._args, 
                                                         function(err, res) {
              perform({
                _id: action._id,
                _action: 'reply',
                _error: err ? err.message : '',
                _result: res
              });
            });
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
  // ### uid
  //
  // Returns a new unique id
  uid = function() {
    return my.salt + '-' + (++my.next_id);
  };

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
      var itv = setTimeout(function() {
        delete my.actions[action._id.toString()];
        return cb_(common.err('Action timed out: ' + action._id,
                              'thrust:action_timeout'));
      }, my.ACTION_TIMEOUT);
      my.actions[action._id.toString()] = function(err, res) {
        delete my.actions[action._id.toString()];
        clearTimeout(itv);
        return cb_(err, res);
      };
    }
    my.client.write(JSON.stringify(action) + "\n" + my.BOUNDARY);
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
    var now = Date.now();

    that.session = function(args) {
      return require('./api.session.js').session({ api: that, args: args });
    };
    that.window = function(args) {
      return require('./api.window.js').window({ api: that, args: args });
    };
    that.menu = function(args) {
      return require('./api.menu.js').menu({ api: that, args: args });
    };

    my.client = net.connect({ path: my.thrust_sock }, function(err) {
      if(err) {
        return cb_(err);
      }
      return cb_(null, that);
    });
    my.client.on('data', client_data_handler);
  };


  if (os.platform() === 'win32') {
    my.thrust_sock = '\\\\.\\pipe\\thrust.' + uid() + '.sock';
  } 
  else {
    my.thrust_sock = path.join(os.tmpdir(),
                               'thrust.' + uid() + '.sock');
  }
  /* TODO(spolu): Remove temporary solution */
  my.thrust_sock = '/tmp/_thrust_shell.sock';


  common.getter(that, 'thrust_sock', my, 'thrust_sock');

  common.method(that, 'uid', uid, _super);
  common.method(that, 'action_id', action_id, _super);
  common.method(that, 'perform', perform, _super);
  common.method(that, 'register', register, _super);
  common.method(that, 'unregister', unregister, _super);

  common.method(that, 'init', init, _super);

  return that;
}

exports.api = api;
