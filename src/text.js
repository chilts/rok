// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokText() {
  Rok.call(this)

  // simply call reset to set up our properties
  this.reset()
}
inherits(RokText, Rok)

RokText.prototype.props = function props() {
  return [ 'text' ]
}

RokText.prototype._resetProps = function _resetProps() {
  // called by Rok.reset()
  this.text = ''
}

RokText.prototype.set = function set(text) {
  this.text = text
  this.notify()
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokText

// --------------------------------------------------------------------------------------------------------------------
