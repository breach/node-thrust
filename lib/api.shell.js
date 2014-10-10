/*
 * node-thrust: api.shell.js
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
var base = require('./api.base.js');

var async = require('async');
var events = require('events');

// ## shell
// 
// Base object representation. Implements creation and base method call as well
// as event emition and remote method call functionalities.
//
// Arguments:
//  - `root_url` : the url to open
//  - `title`    : the title to use for the shell window
//  - `session`  : the session to use
//  - `size`     : { width, height } size object
//
// ```
// @spec { api, args }
// @inherits base
// ```
var shell = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  //
  // #### _public_
  //
  var show;   /* show(cb_); */
  var close;  /* close(cb_); */

  //
  // #### _protected_
  //
  var create; /* create(); */

  //
  // #### _that_
  //
  var that = require('./api.base.js').base({ 
    api: spec.api,
    type: 'shell',
    args: spec.args 
  });

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/

  /****************************************************************************/
  /* PROTECTED METHODS */
  /****************************************************************************/
  // ### create
  //
  // Override of creation method called at construction to ensure initialization
  // of the Creation method called at construction
  // ```
  // @args {object} arguments for creation
  // ```
  create = function(args) {
    if(args.session) {
      args.session.pre(function(err) {
        if(!err) {
          args.session_id = args.session.target()
        }
        delete args.session;
        _super.create(args);
      });
    }
    else {
      _super.create(args);
    }
  };

  /****************************************************************************/
  /* PUBLIC METHODS */
  /****************************************************************************/
  // ### show
  //
  // Shows the created shell window
  // ```
  // @cb_ {function(err)}
  // ```
  show = function(cb_) {
    that.call('show', {}, cb_);
  };

  // ### close
  //
  // Closes the window
  // ```
  // @cb_ {function(err)}
  // ```
  close = function(cb_) {
    /* TODO(spolu) */
  };

  common.method(that, 'create', create, _super);

  common.method(that, 'show', show, _super);
  common.method(that, 'close', close, _super);

  return that;
}

exports.shell = shell;
