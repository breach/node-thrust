/*
 * node-thrust: api.session.js
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

// ## session
// 
// API `menu` object reprensetation.
//
// ```
// @spec { api, args }
// @inherits base
// ```
var session = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  //
  // #### _public_
  //
  
  //
  // #### _protected_
  //
  var invoke_cookies_load;         /* invoke_cookies_load(args, cb_); */
  var invoke_cookies_load_for_key; /* invoke_cookies_load_for_key(args, cb_); */
  var invoke_cookies_flush;        /* invoke_cookies_flush(args, cb_); */

  //
  // #### _private_
  //

  //
  // #### _that_
  //
  var that = require('./api.base.js').base({ 
    api: spec.api,
    type: 'session',
    args: spec.args 
  });

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/

  /****************************************************************************/
  /* REMOTE INVOCATION METHODS */
  /****************************************************************************/
  // ### invoke_cookies_load
  //
  // Transfer the initial cookies loading to the installed handler or reply with
  // an empty array
  // ```
  // @args {object} remote method argument
  // @cb_  {function(err, res)}
  // ```
  invoke_cookies_load = function(args, cb_) {
    return cb_(null, { cookies: [] });
  };

  // ### invoke_cookies_load_for_key
  //
  // Transfer the cookie loading call for a given domain key or reply with an
  // empty array
  // ```
  // @args {object} remote method argument
  // @cb_  {function(err, res)}
  // ```
  invoke_cookies_load_for_key = function(args, cb_) {
    return cb_(null, { cookies: [] });
  };
  
  // ### invoke_cookies_flush
  //
  // Transfer the cookie flush invocation the installed handler or return the
  // callback directly.
  // ```
  // @args {object} remote method argument
  // @cb_  {function(err, res)}
  // ```
  invoke_cookies_flush = function(args, cb_) {
    return cb_();
  }

  /*
  that.on('cookies_add', function(evt) {
    common.log.out('COOKIES_ADD');
    common.log.out(JSON.stringify(evt, null, 2));
  });
  that.on('cookies_update_access_time', function(evt) {
    common.log.out('COOKIES_UPDATE_ACCESS_TIME');
    common.log.out(JSON.stringify(evt, null, 2));
  });
  that.on('cookies_delete', function(evt) {
    common.log.out('COOKIES_DELETE');
    common.log.out(JSON.stringify(evt, null, 2));
  });
  */

  /****************************************************************************/
  /* PUBLIC METHODS */
  /****************************************************************************/

  common.method(that, 'invoke_cookies_load', invoke_cookies_load, _super);
  common.method(that, 'invoke_cookies_load_for_key', invoke_cookies_load_for_key, _super);
  common.method(that, 'invoke_cookies_flush', invoke_cookies_flush, _super);

  return that;
}

exports.session = session;
