// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokObject() {
  Rok.call(this)

  // simply call reset to set up our properties
  this.reset()
}
inherits(RokObject, Rok)

RobObject.prototype.props = function props() {
  return [ 'obj' ]
}

RobObject.prototype._resetProps = function _resetProps() {
  // called by Rok.reset()
  this.obj = null
}

RobObject.prototype.get = function get() {
  return this.obj
}

RobObject.prototype.set = function set(obj) {
  this.obj = obj
  this.notify()
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RobObject

// --------------------------------------------------------------------------------------------------------------------
