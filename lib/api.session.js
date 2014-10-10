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
var base = require('./api.base.js');

var async = require('async');
var events = require('events');

// ## session
// 
// Base object representation. Implements creation and base method call as well
// as event emition and remote method call functionalities.
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
  // #### _private_
  //

  //
  // #### _that_
  //
  var that = base({ api: spec.api,
                    type: 'session',
                    args: spec.args });

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/

  /****************************************************************************/
  /* PUBLIC METHODS */
  /****************************************************************************/

  return that;
}

exports.session = session;
