var async = require('async');
var common = require('../lib/common.js');

var _api = null;
var _window = null;

async.series([
  function(cb_) {
    require('./base.js')(function(err, api) {
      _api = api;
      return cb_(err);
    });
  },
  function(cb_) {
    _window = _api.window({
      size: {
        width: 1024,
        height: 768
      }
    });
    return cb_();
  },
  function(cb_) {
    _window.show(cb_);
  },
  function(cb_) {
    _window.set_fullscreen(true, cb_);
  }
], function(err) {
  if(err) {
    common.log.out('FAILED');
    common.log.error(err);
  }
  common.log.out('OK');
});
