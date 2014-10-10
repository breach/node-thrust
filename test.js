var async = require('async');

var API = null;
var shell = null;

async.series([
  function(cb_) {
    require('./index.js')(function(err, api) {
      API = api;
      return cb_(err);
    });
  },
  function(cb_) {
    shell = API.shell({
      size: {
        width: 640,
        height: 480
      }
    });
    shell.show(cb_);
  }
], function(err) {
  console.log('DONE [' + err + ']');
});

/*
var main = function() {

  perform({
    _id: ++action_id,
    _action: "create",
    _type: "session",
    _args: {
      off_the_record: false
    }
  }, function(err, res) {
    console.log('SESSION: ' + JSON.stringify(res));

    perform({
      _id: ++action_id,
      _action: "call",
      _target: res._target,
      _method: "devtools_url",
      _args: {}
    }, function(err, res) {
      console.log('DEVTOOLS: ' + JSON.stringify(res));
    });

    perform({
      _id: ++action_id,
      _action: "create",
      _type: "shell",
      _args: {
        root_url: "file:///" + __dirname + "/test.html",
        title: "ExoShell TEST 1",
        session_id: res._target,
        size: {
          width: 650,
          height: 480
        }
      }
    }, function(err, res) {
      console.log('SHELL: ' + JSON.stringify(res));
      SHELL_ID = res._target;

      perform({
        _id: ++action_id,
        _action: "call",
        _target: res._target,
        _method: "show",
        _args: {}
      }, function(err, res) {
        console.log('SHOW: ' + JSON.stringify(res));
      });


      perform({
        _id: ++action_id,
        _action: "create",
        _type: "menu",
        _args: {}
      }, function(err, res) {
        console.log('MENU: ' + JSON.stringify(res));

        perform({
          _id: ++action_id,
          _action: "call",
          _target: res._target,
          _method: "insert_item_at",
          _args: {
            index: 0,
            command_id: 1,
            label: "Test Menu Item"
          }
        }, function(err, res) {
          console.log('INSERT_ITEM_AT: ' + JSON.stringify(res));
        });

        perform({
          _id: ++action_id,
          _action: "call",
          _target: res._target,
          _method: "attach",
          _args: {
            shell_id: SHELL_ID
          }
        }, function(err, res) {
          console.log('ATTACH: ' + JSON.stringify(res));
        });
      });
    });
  });
};
*/
