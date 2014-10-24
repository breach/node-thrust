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
    'linux': path.join(my.THRUST_PATH, 'thrust_shell'),
    'win32': path.join(my.THRUST_PATH, 'thrust_shell'),
    'darwin': path.join(my.THRUST_PATH,
                        'ThrustShell.app', 'Contents', 'MacOS', 'ThrustShell'),
  }
  my.salt = Date.now().toString();
  my.next_id = Math.floor(Math.random() * 1000);

  //
  // #### _public_
  //
  var spawn;             /* spawn(cb_); */

  //
  // #### _private_
  //
  var uid;                  /* uid(); */
  
  //
  // #### _that_
  //
  var that = {};

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/
  // ### uid
  //
  // Returns a new unique id
  uid = function() {
    return my.salt + '-' + (++my.next_id);
  };

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
  // @cb_       {function(err, api)}
  // @exec_path {string} the executable to use
  // ```
  spawn = function(cb_, exec_path) {
    if(!my.THRUST_EXEC[os.platform()]) {
      return cb_(common.err('Platform not supported: ' + os.platform(),
                            'thrust:platform_not_supported'));
    }

    if(os.platform() === 'win32') {
      my.thrust_sock = '\\\\.\\pipe\\thrust.' + uid() + '.sock';
    } 
    else {
      my.thrust_sock = path.join(os.tmpdir(),
                                 'thrust.' + uid() + '.sock');
    }

    exec_path = exec_path || my.THRUST_EXEC[os.platform()];
    common.log.out('SPAWING ' + exec_path);

    var p = require('child_process').spawn(exec_path,
                                           ['--socket-path=' + my.thrust_sock]);
    p.stderr.on('data', function(c) {
      require('util').print(c.toString());
    });

    require('./api.js').api({ 
      process: p
    }).init(cb_);
  };

  common.method(that, 'spawn', spawn, _super);

  return that;
};

exports.thrust = thrust;

