// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokText(name, title, opts, meta) {
  Rok.call(this)

  // simply call reset to set up our properties
  this.reset()

  // set some of the properties from the incoming args
  this.name  = name || ''
  this.title = title || ''

  // save the meta info
  this.opts = opts || {}
  this.meta = meta || {}

  // simply call reset to set up our properties
  this.reset()
}
inherits(RokText, Rok)

RokText.prototype.type = function type() {
  return 'Text'
}

RokText.prototype.props = function props() {
  return [ 'name', 'title', 'text' ]
}

RokText.prototype.objects = function props() {
  return [ 'opts', 'meta' ]
}

// Called by Rok.reset().
RokText.prototype._resetProps = function _resetProps() {
  this.text = ''
}

// --- type fields ---

RokText.prototype.getName = function getName() {
  return this.name
}

RokText.prototype.getTitle = function getTitle() {
  return this.title
}

RokText.prototype.getOpts = function getOpts() {
  return this.opts
}

RokText.prototype.getMeta = function getMeta() {
  return this.meta
}

// --- value fields ---

RokText.prototype.get = function get() {
  console.warn("DEPRECATED: Rok.Text.get() - use Rok.Text.getText() instead")
  return this.text
}

RokText.prototype.getText = function getText() {
  return this.text
}

RokText.prototype.set = function set(text) {
  console.warn("DEPRECATED: Rok.Text.set() - use Rok.Text.setText() instead")
  this.text = text
  this.notify()
}

RokText.prototype.setText = function setText(text) {
  this.text = text
  this.notify()
}

// --- helpers ---

var isNotEmptyString = new RegExp(/\S/);
RokText.prototype.hasAnything = function hasAnything() {
  return isNotEmptyString.test(this.text)
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokText

// --------------------------------------------------------------------------------------------------------------------
