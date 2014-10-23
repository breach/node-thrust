/*
 * node-thrust [test]: base.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-10-23 spolu  Creation
 */
"use strict"

// ### base
// 
// Base test class, sets up the API on a specific executable if passed as an
// argument or the one installed locally

module.exports = function(cb_) {
  console.log(process.argv);
  require('../index.js')(cb_);
};
