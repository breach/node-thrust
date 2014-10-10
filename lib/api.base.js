/*
 * node-thrust: api.base.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-10-10 spolu  Creation
 */
"use strict"

var common = require('./common.js');

var async = require('async');
var events = require('events');

// ## base
// 
// Base object representation. Implements creation and base method call as well
// as event emition and remote method call functionalities.
//
// ```
// @spec { api, type, args }
// @inherits events.EventEmitter
// ```
var base = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  my.type = spec.type || 'INVALID_TYPE';
  my.api = spec.api;

  my.target = null;
  my.create_error = null;

  //
  // #### _protected_
  //
  var pre;     /* pre(cb_); */
  var call;    /* call(method, args, cb_); */
  var invoke;  /* invoke(method, args, cb_); */
  var create;  /* create(); */


  //
  // #### _that_
  //
  var that = new events.EventEmitter();

  /****************************************************************************/
  /* PROTECTED METHODS */
  /****************************************************************************/
  // ### pre
  //
  // Function called before method invokation to ensure the object is fully
  // constructed
  // ```
  // @cb_ {function(err)}
  // ```
  pre = function(cb_) {
    if(my.create_error) {
      return cb_(err);
    }
    else if(!my.target) {
      that.on('_ready', function() {
        return cb_();
      });
    }
    else {
      return cb_();
    }
  };

  // ### call
  //
  // Call a remote method
  // ```
  // @method {string} the method name
  // @args   {object} the argument object
  // @cb_    {function(err, res)} the callback function
  // ```
  call = function(method, args, cb_) {
    pre(function(err) {
      if(err) {
        return cb_(err);
      }
      my.api.perform({
        _id: my.api.action_id(),
        _action: "call",
        _target: my.target,
        _method: method,
        _args: args || {}
      }, cb_);
    });
  };

  // ### invoke
  //
  // Invokes a local method on the object if it exists. Any object inheriting
  // this base object is supposed to imeplement all remote method.
  // ```
  // @method {string} the method name
  // @args   {object} the arguments object
  // @cb_    {function(err, res)} the callback function
  // ```
  invoke = function(method, args, cb_) {
    pre(function(err) {
      if(err) {
        return cb_(err);
      }
      else if(!that[method]) {
        return cb_(common.err('Method not found [' + my.type + ']: ' + method, 
                              'thrust:method_not_found'));
      }
      else {
        return that[method](args, cb_);
      }
    });
  };

  // ### create
  //
  // Creation method called at construction
  // ```
  // @args {object} args object passed from spec
  // ```
  create = function(args) {
    my.api.perform({
      _id: my.api.action_id(),
      _action: 'create',
      _type: my.type,
      _args: spec.args
    }, function(err, res) {
      if(err) {
        my.create_error = err;
      }
      else {
        my.target = res._target;
        that.emit('_ready');
      }
    });
  };

  process.nextTick(function() {
    that.create(spec.args);
  });

  common.method(that, 'pre', pre, _super);
  common.method(that, 'call', call, _super);
  common.method(that, 'invoke', invoke, _super);
  common.method(that, 'create', create, _super);

  common.getter(that, 'target', my, 'target');

  return that;
}

exports.base = base;
