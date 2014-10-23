var async = require('async');

var API = null;

var window = null;
var session = null;
var menu = null;
var file_menu = null;

async.series([
  function(cb_) {
    require('./index.js')(function(err, api) {
      API = api;
      return cb_(err);
    }/*, '/home/spolu/src/thrust/thrust/out/Release/thrust_shell' */);
  },
  function(cb_) {
    session = API.session({
      cookie_store: true,
      off_the_record: false
    });
    return cb_();
  },
  function(cb_) {
    window = API.window({
      session: session,
      size: {
        width: 800,
        height: 600
      }
    });
    return cb_();
  },
  /*
  function(cb_) {
    menu = API.menu({});
    async.parallel([
      function(cb_) {
        menu.add_item(1, "File", cb_);
      },
      function(cb_) {
        menu.add_item(2, "Edit", cb_);
      }
    ], cb_);
  },
  function(cb_) {
    file_menu = API.menu({});
    file_menu.on('execute', function(e) {
      console.log('EXECUTE: ' + JSON.stringify(e));
      file_menu.set_enabled(e.command_id, false, function(err) {
        if(err) {
          console.log(err);
        }
      });
    });
    async.parallel([
      function(cb_) {
        file_menu.add_item(3, 'Open', cb_);
      },
      function(cb_) {
        file_menu.add_item(4, 'Close', cb_);
      },
      function(cb_) {
        file_menu.add_separator(cb_);
      },
      function(cb_) {
        file_menu.add_check_item(5, 'Check', cb_);
      }
    ], cb_);
  },
  function(cb_) {
    menu.add_submenu(6, "Test", file_menu, cb_);
  },
  function(cb_) {
    menu.attach(window, cb_);
  },
  */
  function(cb_) {
    window.show(cb_);
  },
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
      _type: "window",
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
            window_id: SHELL_ID
          }
        }, function(err, res) {
          console.log('ATTACH: ' + JSON.stringify(res));
        });
      });
    });
  });
};
*/
