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

// ## menu
// 
// API `menu` object reprensetation.
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
  var popup;                 /* popup(window, cb_); */
  var set_application_menu;  /* set_application_menu(cb_); */

  var add_item;              /* add_item(command_id, label, cb_); */
  var add_check_item;        /* add_check_item(command_id, label, cb_); */
  var add_radio_item;        /* add_radio_item(command_id, label, group_id, cb_); */
  var add_separator;         /* add_separator(cb_); */

  var set_checked;           /* set_checked(command_id, value); */
  var set_enabled;           /* set_enabled(command_id, value); */
  var set_visible;           /* set_visible(command_id, value); */

  var add_submenu;           /* add_submenu(command_id, label, menu, cb_); */

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
  // ### popup
  //
  // Popups the menu to the window passed as argument
  // ```
  // @window {object} the window on which to popup the menu
  // @cb_   {function(err)}
  // ```
  popup = function(window, cb_) {
    window.pre(function(err) {
      if(err) {
        return cb_(err);
      }
      that.call('popup', { window_id: window.target() }, cb_);
    });
  };

  // ### set_application_menu
  // 
  // Sets the global application menu on OSX
  // ```
  // @cb_ {function(err)}
  // ```
  set_application_menu = function(cb_) {
    that.call('set_application_menu', {}, cb_);
  };


  // ### add_item
  //
  // Adds an item with the provided `command_id` to the menu
  // ```
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @cb_        {function(err)}
  // ```
  add_item = function(command_id, label, cb_) {
    that.call('add_item', {
      command_id: command_id,
      label: label
    }, cb_);
  };

  // ### add_check_item
  //
  // Adds a check item with the provided `command_id` to the menu
  // ```
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @cb_        {function(err)}
  // ```
  add_check_item = function(command_id, label, cb_) {
    that.call('add_check_item', {
      command_id: command_id,
      label: label
    }, cb_);
  };

  // ### add_radio_item
  //
  // Adds a check item with the provided `command_id` to the menu
  // ```
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @group_id   {number} the group id
  // @cb_        {function(err)}
  // ```
  add_radio_item = function(command_id, label, group_id, cb_) {
    that.call('add_radio_item', {
      command_id: command_id,
      label: label,
      group_id: group_id
    }, cb_);
  };

  // ### add_separator
  //
  // Adds a separator item to the menu
  // ```
  // @cb_   {function(err)}
  // ```
  add_separator = function(cb_) {
    that.call('add_separator', {}, cb_);
  };

  // ### add_submenu
  //
  // Adds a sub menu to the menu
  // ```
  // @command_id {number} the command_id
  // @label      {string} the label to use
  // @menu       {object} the group id
  // @cb_        {function(err)}
  // ```
  add_submenu = function(command_id, label, menu, cb_) {
    menu.pre(function(err) {
      if(err) {
        return cb_(err);
      }
      that.call('add_submenu', {
        command_id: command_id,
        label: label,
        menu_id: menu.target()
      }, cb_);
    });
  };

  // ### set_checked
  //
  // Sets whether a command_id is checked or not
  // ```
  // @command_id {number} the command_id
  // @value      {boolean} is checked or not
  // @cb_        {function(err)}
  // ```
  set_checked = function(command_id, value, cb_) {
    that.call('set_checked', {
      command_id: command_id,
      value: value
    }, cb_);
  };

  // ### set_enabled
  //
  // Sets whether a command_id is enabled or not
  // ```
  // @command_id {number} the command_id
  // @value      {boolean} is enabled or not
  // ```
  set_enabled = function(command_id, value, cb_) {
    that.call('set_enabled', {
      command_id: command_id,
      value: value
    }, cb_);
  };

  // ### set_visible
  //
  // Sets whether a command_id is visible or not
  // ```
  // @command_id {number} the command_id
  // @value      {boolean} is visible or not
  // ```
  set_visible = function(command_id, value, cb_) {
    that.call('set_visible', {
      command_id: command_id,
      value: value
    }, cb_);
  };


  common.method(that, 'popup', popup, _super);
  common.method(that, 'set_application_menu', set_application_menu, _super);

  common.method(that, 'add_item', add_item, _super);
  common.method(that, 'add_check_item', add_check_item, _super);
  common.method(that, 'add_radio_item', add_radio_item, _super);
  common.method(that, 'add_separator', add_separator, _super);
  common.method(that, 'add_submenu', add_submenu, _super);

  common.method(that, 'set_checked', set_checked, _super);
  common.method(that, 'set_enabled', set_enabled, _super);
  common.method(that, 'set_visible', set_visible, _super);

  return that;
}

exports.menu = menu;
