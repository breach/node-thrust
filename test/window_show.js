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
        width: 800,
        height: 600
      }
    });
    return cb_();
  },
], function(err) {
  if(err) {
    common.log.out('FAILED');
    common.log.error(err);
  }
  common.log.out('OK');
});
