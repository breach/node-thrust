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
  var attach;            /* attach(shell, cb_); */

  var item_at;       /* item_at(index, command_id, label, cb_); */
  var check_item_at; /* check_item_at(index, command_id, label, cb_); */
  var radio_item_at; /* radio_item_at(index, command_id, label, group_id, cb_); */
  var separator_at;  /* separator_at(index, cb_); */

  var submenu_at;    /* submenu_at(index, command_id, label, menu, cb_); */

  //
  // #### _private_
  //

  //
  // #### _that_
  //
  var that = require('./api.base.js').base({ 
    api: spec.api,
    type: 'menu',
    args: spec.args 
  });

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
      that.call('attach', { shell_id: shell.target() }, cb_);
    });
  };

  // ### item_at
  //
  // Inserts an item at the given `index` with the provided `command_id`
  // ```
  // @index      {number} the index of the item
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @cb_        {function(err)}
  // ```
  item_at = function(index, command_id, label, cb_) {
    that.call('insert_item_at', {
      index: index,
      command_id: command_id,
      label: label
    }, cb_);
  };

  // ### check_item_at
  //
  // Inserts a check item at the given `index` with the provided `command_id`
  // ```
  // @index      {number} the index of the item
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @cb_        {function(err)}
  // ```
  check_item_at = function(index, command_id, label, cb_) {
    that.call('insert_check_item_at', {
      index: index,
      command_id: command_id,
      label: label
    }, cb_);
  };

  // ### check_radio_at
  //
  // Inserts a check item at the given `index` with the provided `command_id`
  // ```
  // @index      {number} the index of the item
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @group_id   {number} the group id
  // @cb_        {function(err)}
  // ```
  radio_item_at = function(index, command_id, label, group_id, cb_) {
    that.call('insert_radio_item_at', {
      index: index,
      command_id: command_id,
      label: label,
      group_id: group_id
    }, cb_);
  };

  // ### separator_at
  //
  // Inserts a separator item at the given `index`
  // ```
  // @index {number} the index of the item
  // @cb_   {function(err)}
  // ```
  separator_at = function(index, cb_) {
    that.call('insert_separator_at', {
      index: index,
    }, cb_);
  };

  // ### insert_submenu_at
  //
  // Inserts a sub menu at the given index
  // ```
  // @index      {number} the index of the item
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @menu       {object} the group id
  // @cb_        {function(err)}
  // ```
  submenu_at = function(index, command_id, label, menu, cb_) {
    menu.pre(function(err) {
      if(err) {
        return cb_(err);
      }
      that.call('insert_submenu_at', {
        index: index,
        command_id: command_id,
        label: label,
        menu_id: menu.target()
      }, cb_);
    });
  };


  common.method(that, 'attach', attach, _super);

  common.method(that, 'item_at', item_at, _super);
  common.method(that, 'check_item_at', check_item_at, _super);
  common.method(that, 'radio_item_at', radio_item_at, _super);
  common.method(that, 'separator_at', separator_at, _super);
  common.method(that, 'submenu_at', submenu_at, _super);

  return that;
}

exports.menu = menu;
