var common = require('../lib/common.js');

var async = require('async');

var _api = null;
var _window_1 = null;
var _window_2 = null;
var _menu = null;
var _file = null;

async.series([
  function(cb_) {
    require('./base.js')(function(err, api) {
      _api = api;
      return cb_(err);
    });
  },
  function(cb_) {
    _window_1 = _api.window({
      size: {
        width: 1024,
        height: 768
      }
    });
    return cb_();
  },
  function(cb_) {
    _file = _api.menu({});
    _file.on('execute', function(e) {
      console.log('EXECUTE: ' + JSON.stringify(e));
      _file.set_enabled(e.command_id, false, function(err) {
        if(err) {
          console.log(err);
        }
      });
    });
    async.parallel([
      function(cb_) {
        _file.add_item(3, 'Open', cb_);
      },
      function(cb_) {
        _file.add_item(4, 'Close', cb_);
      },
      function(cb_) {
        _file.add_separator(cb_);
      },
      function(cb_) {
        _file.add_check_item(5, 'Check', cb_);
      }
    ], cb_);
  },
  function(cb_) {
    _menu = _api.menu({});
    _menu.add_submenu(6, "Test", _file, cb_);
  },
  function(cb_) {
    _window_1.show(cb_);
  },
  function(cb_) {
    _menu.set_application_menu(cb_);
  },
  function(cb_) {
    _window_2 = _api.window({
      size: {
        width: 1024,
        height: 768
      }
    });
    return cb_();
  },
  function(cb_) {
    _window_2.show(cb_);
  },
], function(err) {
  if(err) {
    common.log.out('FAILED');
    common.log.error(err);
  }
  common.log.out('OK');
});
