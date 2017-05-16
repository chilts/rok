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

RokObject.prototype.type = function type() {
  return 'Object'
}

RokObject.prototype.props = function props() {
  return [ 'obj' ]
}

RokObject.prototype._resetProps = function _resetProps() {
  // called by Rok.reset()
  this.obj = null
}

RokObject.prototype.get = function get() {
  return this.obj
}

RokObject.prototype.set = function set(obj) {
  this.obj = obj
  this.notify()
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokObject

// --------------------------------------------------------------------------------------------------------------------
