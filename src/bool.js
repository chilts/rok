// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokBoolean() {
  Rok.call(this)

  // simply call reset to set up our properties
  this.reset()
}
inherits(RokBoolean, Rok)

RokBoolean.prototype.props = function props() {
  return [ 'bool' ]
}

RokBoolean.prototype._resetProps = function _resetProps() {
  // called by Rok.reset()
  this.bool = false
}

RokBoolean.prototype.get = function get() {
  return this.bool
}

RokBoolean.prototype.set = function set(b) {
  this.bool = !!b
  this.notify()
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokBoolean

// --------------------------------------------------------------------------------------------------------------------
