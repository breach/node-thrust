/*
 * node-thrust: scripts/bootstrap.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-10-16 spolu   Creation
 */

var async = require('async');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs-extra');
var os = require('os');
var request = require('request');

var common = require('../lib/common.js');
var unzip = require('unzip');

/******************************************************************************/
/* CONFIGURATION */
/******************************************************************************/
var MODULE_PATH = path.join(__dirname, '..');
var VENDOR_PATH = path.join(MODULE_PATH, 'vendor');

var package_json = require(path.join(MODULE_PATH, 'package.json'));

var THRUST_BASE_URL = package_json.THRUST_BASE_URL;
var THRUST_VERSION = package_json.THRUST_VERSION;

var THRUST_PATH = path.join(VENDOR_PATH, 'thrust');
var THRUST_VERSION_PATH = path.join(THRUST_PATH, '.version');

var THRUST_RELEASE_PLATFORM = package_json.THRUST_RELEASE_PLATFORMS
                                      [os.platform()]
                                      [os.arch()];

var THRUST_RELEASE_FILENAME = 'thrust-' + THRUST_VERSION + '-' +
                            THRUST_RELEASE_PLATFORM + '.zip';

var THRUST_RELEASE_URL = THRUST_BASE_URL + 
                         THRUST_VERSION + '/' + 
                         THRUST_RELEASE_FILENAME;

/******************************************************************************/
/* BOOTSTRAPPING STEPS */
/******************************************************************************/
// ### install_thrust
//
// Installs thrust binary distribution for the adequate platform if not  already 
// present unless the force parameter is passed.
// ```
// @force {boolean} force install of thrust binary distribution
// ```
var install_thrust = function(force, cb_) {
  async.series([
    /* Clean if force flag */
    function(cb_) {
      if(force) {
        return fs.remove(THRUST_PATH, cb_);
      }
      return cb_();
    },
    /* Check for the THRUST_VERSION_PATH or remove it */
    function(cb_) {
      console.log(THRUST_VERSION_PATH)
      fs.readFile(THRUST_VERSION_PATH, function(err, data) {
        if(err && err.code !== 'ENOENT') {
          return cb_(err);
        }
        else if(err && err.code === 'ENOENT') {
          fs.remove(THRUST_PATH, cb_);
        }
        else {
          if(data.toString() === THRUST_VERSION) {
            /* We're done here! */
            return cb_(common.err('thrust-' + THRUST_VERSION + 
                                  ' already installed in ' + 
                                  path.join(THRUST_PATH),
                                  'bootstrap:already_installed'));
          }
          else {
            fs.remove(THRUST_PATH, cb_);
          }
        }
      });
    },
    /* Create THRUST_PATH */
    function(cb_) {
      console.log('Creating: ' + THRUST_PATH);
      mkdirp(THRUST_PATH, cb_);
    },
    /* Download THRUST */
    function(cb_) {
      console.log('Downloading: ' + THRUST_RELEASE_URL);

      var itv = setInterval(function() {
        process.stdout.write('.');
      }, 1000);
      var finish = function(err) {
        clearInterval(itv);
        process.stdout.write('\n');
        return cb_(err);
      }

      request(THRUST_RELEASE_URL)
        .on('error', finish)
        .on('end', finish)
        .pipe(fs.createWriteStream(path.join(THRUST_PATH, 
                                             THRUST_RELEASE_FILENAME)));
    },
    /* Extract thrust in THRUST_PATH */
    function(cb_) {
      console.log('Extracting ' + path.join(THRUST_PATH, 
                                            THRUST_RELEASE_FILENAME));
      if(os.platform() === 'darwin') {
        var unzip_p = require('child_process').spawn('unzip', 
          [ '-oqq', path.join(THRUST_PATH, THRUST_RELEASE_FILENAME) ], {
            cwd: THRUST_PATH
        });
        unzip_p.on('close', function (code) {
          if(code !== 0) {
            return cb_(common.err('Extraction failed with code: ' + code,
                                  'boostrap:failed_extraction'));
          }
          return cb_();
        });
      }
      else {
        async.series([
          function(cb_) {
            fs.createReadStream(path.join(THRUST_PATH, THRUST_RELEASE_FILENAME))
              .on('error', cb_)
              .pipe(unzip.Extract({
                path: THRUST_PATH
              }).on('close', cb_));
          },
          function(cb_) {
            if(os.platform() === 'linux') {
              var exec_path = path.join(THRUST_PATH, 'thrust_shell');
              fs.chmod(exec_path, 0755, cb_);
            }
            else {
              return cb_();
            }
          }
        ], cb_);
      }
    },
    /* Cleaning up */
    function(cb_) {
      console.log('Cleaning up ' + path.join(THRUST_PATH, 
                                             THRUST_RELEASE_FILENAME));
      fs.remove(path.join(THRUST_PATH, THRUST_RELEASE_FILENAME), cb_);
    },
    /* Create THRUST_VERSION */
    function(cb_) {
      fs.writeFile(THRUST_VERSION_PATH, THRUST_VERSION, {
        flag: 'w'
      }, cb_);
    }
  ], cb_);
};

/******************************************************************************/
/* MAIN */
/******************************************************************************/
var argv = require('optimist')
.usage('Usage: $0 [-f]')
.argv;

async.series([
  function(cb_) {
    install_thrust(argv.f || false, function(err) {
      if(err && err.name === 'bootstrap:already_installed') {
        console.log(err.message);
        return cb_();
      }
      return cb_(err);
    });
  }
], function(err) {
  if(err) {
    common.fatal(err);
  }
  console.log('Done!');
  process.exit(0);
});

