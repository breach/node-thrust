/*
 * node-thrust: api.menu.js
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

// ## menu
// 
// Base object representation. Implements creation and base method call as well
// as event emition and remote method call functionalities.
//
// ```
// @spec { api, args }
// @inherits base
// ```
var menu = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  //
  // #### _public_
  //
  var attach;          /* attach(shell, cb_); */

  var insert_item_at;  /* insert_item_at(index, command_id, label, cb_); */

  //
  // #### _private_
  //

  //
  // #### _that_
  //
  var that = base({ api: spec.api,
                    type: 'menu',
                    args: spec.args });

  /****************************************************************************/
  /* PRIVATE HELPERS */
  /****************************************************************************/

  /****************************************************************************/
  /* PUBLIC METHODS */
  /****************************************************************************/
  // ### attach
  //
  // Attaches the menu to the shell window passed as argument
  // ```
  // @shell {object} the shell to attach to
  // @cb_   {function(err)}
  // ```
  attach = function(shell, cb_) {
    shell.pre(function(err) {
      if(err) {
        return cb_(err);
      }
      call('attach', { shell_id: shell.target() }, cb_);
    });
  };

  // ### insert_item_at
  //
  // Inserts an item at the given `index` with the provided `command_id`
  // ```
  // @index      {number} the index of the item
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @cb_   {function(err)}
  // ```
  insert_item_at = function(index, command_id, label, cb_) {
    call('insert_item_at', {
      index: index,
      command_id: command_id,
      label: label
    }, cb_);
  };

  common.method(that, 'attach', attach, _super);

  common.method(that, 'insert_item_at', insert_item_at, _super);

  return that;
}

exports.menu = menu;
