/*
 * node-thrust: thrust.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-10-09 spolu  Creation
 */
"use strict"

var common = require('./common.js');

var async = require('async');
var path = require('path');
var os = require('os');

// ## thrust
//
// Main node-thrust entry point. See `spawn` method.
//
// ```
// @spec {}
// @inherits {}
// ```
var thrust = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  my.THRUST_PATH = path.join(__dirname, '..', 'vendor', 'thrust');
  my.THRUST_EXEC = {
    'linux': path.join(my.THRUST_PATH, 'thrust'),
    'win32': path.join(my.THRUST_PATH, 'thrust'),
    'darwin': path.join(my.THRUST_PATH,
                        'Thrust.app', 'Contents', 'MacOS', 'Atom'),
  }

  //
  // #### _public_
  //
  var spawn;             /* spawn(cb_); */

  //
  // #### _private_
  //
  
  //
  // #### _that_
  //
  var that = {};

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/

  /****************************************************************************/
  /* PUBLIC METHODS */
  /****************************************************************************/
  // ### spawn
  //
  // Spawns a new `thrust` instace and returns an associated `api` object
  // to access its API. The `api` object communicates with the shell process 
  // using unix domain socket.
  //
  // This method can be called multiple times to spawn different instances.
  // ```
  // @cb_ {function(err, api)}
  // ```
  spawn = function(cb_) {
    if(!my.THRUST_EXEC[os.platform()]) {
      return cb_(common.err('Platform not supported: ' + os.platform(),
                            'thrust:platform_not_supported'));
    }

    /*
    var p = require('child_process').spawn(my.THRUST_EXEC[os.platform()],
                                           [api.thrust_sock()], 
                                           { stdio: 'inherit' });
    api.set_process(p);
    */
    require('./api.js').api({}).init(cb_);
  };

  common.method(that, 'spawn', spawn, _super);

  return that;
};

exports.thrust = thrust;

