// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokNumber() {
  Rok.call(this)

  // simply call reset to set up our properties
  this.reset()
}
inherits(RokNumber, Rok)

RokNumber.prototype.props = function props() {
  return [ 'val' ]
}

RokNumber.prototype._resetProps = function _resetProps() {
  // called by Rok.reset()
  this.val = 0
}

RokNumber.prototype.get = function get() {
  return this.val
}

RokNumber.prototype.set = function set(v) {
  this.val = v
  this.notify()
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokNumber

// --------------------------------------------------------------------------------------------------------------------
