/*
 * node-thrust: api.window.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-11-06 spolu  DevTools API
 * - 2014-10-23 spolu  Methods and accessors
 * - 2014-10-14 spolu  Renaming `shell` -> `window`
 * - 2014-10-10 spolu  Creation
 */
"use strict"

var common = require('./common.js');

// ## window
// 
// API `window` object reprensetation.
//
// Arguments:
//  - `root_url` : the url to open
//  - `title`    : the title to use for the window
//  - `session`  : the session to use
//  - `size`     : { width, height } size object
//
// ```
// @spec { api, args }
// @inherits base
// ```
var window = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  //
  // #### _public_
  //
  var show;               /* show(cb_); */
  var focus;              /* focus(cb_); */
  var maximize;           /* maximize(cb_); */
  var unmaximize;         /* unmaximize(cb_); */
  var minimize;           /* minimize(cb_); */
  var restore;            /* restore(cb_); */
  var close;              /* close(cb_); */
  var remote;             /* remote(message, cb_); */

  var set_title;          /* set_title(title, cb_); */
  var set_fullscreen;     /* set_fullscreen(fullscreen, cb_); */
  var set_kiosk;          /* set_kiosk(kiosk, cb_); */
  var open_devtools;      /* open_devtools(cb_); */
  var close_devtools;     /* close_devtools(cb_); */
  var move;               /* move(x, y, cb_); */
  var resize;             /* resize(w, h, cb_); */

  var is_closed;          /* is_closed(cb_); */
  var is_maximized;       /* is_maximized(cb_); */
  var is_minimized;       /* is_minimized(cb_); */
  var is_fullscreen;      /* is_fullscreen(cb_); */
  var is_kiosk;           /* is_kiosk(cb_); */
  var is_devtools_opened; /* is_devtools_opened(cb_); */

  var size;               /* size(cb_); */
  var position;           /* position(cb_); */

  //
  // #### _protected_
  //
  var create; /* create(); */

  //
  // #### _that_
  //
  var that = require('./api.base.js').base({ 
    api: spec.api,
    type: 'window',
    args: spec.args 
  });

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/

  /****************************************************************************/
  /* PROTECTED METHODS */
  /****************************************************************************/
  // ### create
  //
  // Override of creation method called at construction to ensure initialization
  // of the Creation method called at construction
  // ```
  // @args {object} arguments for creation
  // ```
  create = function(args) {
    if(args.session) {
      args.session.pre(function(err) {
        if(!err) {
          args.session_id = args.session.target()
        }
        delete args.session;
        _super.create(args);
      });
    }
    else {
      _super.create(args);
    }
  };

  /****************************************************************************/
  /* PUBLIC METHODS */
  /****************************************************************************/
  // ### show
  //
  // Shows the created window
  // ```
  // @cb_ {function(err)}
  // ```
  show = function(cb_) {
    that.call('show', {}, cb_);
  };

  // ### focus
  //
  // Focuses the window
  // ```
  // @cb_ {function(err)}
  // ```
  focus = function(cb_) {
    that.call('focus', {}, cb_);
  };

  // ### maximize
  //
  // Maximizes the window
  // ```
  // @cb_ {function(err)}
  // ```
  maximize = function(cb_) {
    that.call('maximize', {}, cb_);
  };

  // ### unmaximize
  //
  // Unmaximizes the window
  // ```
  // @cb_ {function(err)}
  // ```
  unmaximize = function(cb_) {
    that.call('unmaximize', {}, cb_);
  };

  // ### close
  //
  // Closes the window
  // ```
  // @cb_ {function(err)}
  // ```
  close = function(cb_) {
    that.call('close', {}, cb_);
  };

  // ### remote
  //
  // Sends a remote message to the window JS context
  // ```
  // @message {object}
  // @cb_     {function(err)}
  // ```
  remote = function(message, cb_) {
    if(typeof message !== 'object') {
      message = { payload: message };
    }
    that.call('remote', { message: message }, cb_);
  };


  // ### set_title
  //
  // Sets the window title
  // ```
  // @title {string} the window title
  // @cb_   {function(err)}
  // ```
  set_title = function(title, cb_) {
    that.call('set_title', { title: title }, cb_);
  };

  // ### set_fullscreen
  //
  // Sets the window fullscreen state
  // ```
  // @fullscreen {boolean} the window fullscreen state
  // @cb_        {function(err)}
  // ```
  set_fullscreen = function(fullscreen, cb_) {
    that.call('set_fullscreen', { fullscreen: fullscreen }, cb_);
  };

  // ### set_kiosk
  //
  // Sets the window kiosk state
  // ```
  // @kiosk {string} the window kiosk state
  // @cb_   {function(err)}
  // ```
  set_kiosk = function(kiosk, cb_) {
    that.call('set_kiosk', { kiosk: kiosk }, cb_);
  };

  // ### open_devtools
  //
  // Opens the devtools view for this window
  // ```
  // @cb_   {function(err)}
  // ```
  open_devtools = function(cb_) {
    that.call('open_devtools', {}, cb_);
  };

  // ### close_devtools
  //
  // Closes the devtools view for this window
  // ```
  // @cb_   {function(err)}
  // ```
  close_devtools = function(cb_) {
    that.call('close_devtools', {}, cb_);
  };

  // ### move
  //
  // Sets the window position
  // ```
  // @x   {number} the window target x position
  // @x   {number} the window target y position
  // @cb_ {function(err)}
  // ```
  move = function(x, y, cb_) {
    that.call('move', { x: x, y: y }, cb_);
  };

  // ### resize
  //
  // Sets the window position
  // ```
  // @width  {number} the window target width
  // @height {number} the window target height
  // @cb_    {function(err)}
  // ```
  resize = function(width, height, cb_) {
    that.call('resize', { width: width, height: height }, cb_);
  };

  
  // ### is_closed
  //
  // Gets the window closed status
  // ```
  // @cb_ {function(err, is_closed)}
  // ```
  is_closed = function(cb_) {
    that.call('is_closed', {}, function(err, res) {
      return cb_(err, res ? res.closed : null);
    });
  };

  // ### is_maximized
  //
  // Gets the window maximization status
  // ```
  // @cb_ {function(err, is_maximized)}
  // ```
  is_maximized = function(cb_) {
    that.call('is_maximized', {}, function(err, res) {
      return cb_(err, res ? res.maximized : null);
    });
  };

  // ### is_minimized
  //
  // Gets the window minimization status
  // ```
  // @cb_ {function(err, is_minimized)}
  // ```
  is_minimized = function(cb_) {
    that.call('is_minimized', {}, function(err, res) {
      return cb_(err, res ? res.minimized : null);
    });
  };

  // ### is_fullscreen
  //
  // Gets the window fullscreen status
  // ```
  // @cb_ {function(err, is_fullscreen)}
  // ```
  is_fullscreen = function(cb_) {
    that.call('is_fullscreen', {}, function(err, res) {
      return cb_(err, res ? res.fullscreen : null);
    });
  };

  // ### is_kiosk
  //
  // Gets the window kiosk status
  // ```
  // @cb_ {function(err, is_kiosk)}
  // ```
  is_kiosk = function(cb_) {
    that.call('is_kiosk', {}, function(err, res) {
      return cb_(err, res ? res.kiosk : null);
    });
  };

  // ### is_devtools_opened
  //
  // Returns wether the devtools view is opened for this window
  // ```
  // @cb_ {function(err, is_kiosk)}
  // ```
  is_devtools_opened = function(cb_) {
    that.call('is_devtools_opened', {}, function(err, res) {
      return cb_(err, res ? res.opened : null);
    });
  };

  // ### size
  //
  // Gets the window size
  // ```
  // @cb_ {function(err, size)}
  // ```
  size = function(cb_) {
    that.call('size', {}, function(err, res) {
      return cb_(err, res ? res.size : null);
    });
  };

  // ### position
  //
  // Gets the window position
  // ```
  // @cb_ {function(err, position)}
  // ```
  position = function(cb_) {
    that.call('position', {}, function(err, res) {
      return cb_(err, res ? res.position : null);
    });
  };

  common.method(that, 'create', create, _super);

  common.method(that, 'show', show, _super);
  common.method(that, 'focus', focus, _super);
  common.method(that, 'maximize', maximize, _super);
  common.method(that, 'unmaximize', unmaximize, _super);
  common.method(that, 'minimize', minimize, _super);
  common.method(that, 'restore', restore, _super);
  common.method(that, 'close', close, _super);
  common.method(that, 'remote', remote, _super);

  common.method(that, 'set_title', set_title, _super);
  common.method(that, 'set_fullscreen', set_fullscreen, _super);
  common.method(that, 'set_kiosk', set_kiosk, _super);
  common.method(that, 'open_devtools', open_devtools, _super);
  common.method(that, 'close_devtools', close_devtools, _super);
  common.method(that, 'move', move, _super);
  common.method(that, 'resize', resize, _super);

  common.method(that, 'is_closed', is_closed, _super);
  common.method(that, 'is_maximized', is_maximized, _super);
  common.method(that, 'is_minimized', is_minimized, _super);
  common.method(that, 'is_fullscreen', is_fullscreen, _super);
  common.method(that, 'is_kiosk', is_kiosk, _super);
  common.method(that, 'is_devtools_opened', is_devtools_opened, _super);

  common.method(that, 'size', size, _super);
  common.method(that, 'position', position, _super);

  return that;
}

exports.window = window;
