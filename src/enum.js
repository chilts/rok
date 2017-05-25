// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokEnum(name, title, opts) {
  Rok.call(this)

  // simply call reset to set up our properties
  this.reset()

  // set some of the properties from the incoming args
  this.name  = name
  this.title = title
  this.meta  = opts.meta || null
  this.max   = opts.max || null

  // start off with empty 'valid' and 'selected'
  this.valid = {}
  this.selected = {}
  // also store 'valid' names in an array so we can keep order
  this.enums = []
}
inherits(RokEnum, Rok)

RokEnum.prototype.type = function type() {
  return 'Enum'
}

RokEnum.prototype.props = function props() {
  return [ 'name', 'title', 'max', ]
}

RokEnum.prototype.objects = function props() {
  return [ 'meta', 'valid', 'enums', 'selected', ]
}

// Called by Rok.reset().
RokEnum.prototype._resetProps = function _resetProps() {
  // We don't reset any other property since they were set on creation (apart from `valid`) and therefore we want to
  // keep them.
  this.selected = {}
}

RokEnum.prototype.getName = function getName() {
  return this.name
}

RokEnum.prototype.getTitle = function getTitle() {
  return this.title
}

RokEnum.prototype.setTitle = function setTitle(title) {
  this.title = title
  this.notify()
}

RokEnum.prototype.setMeta = function setMeta(meta) {
  this.meta = meta
  this.notify()
}

RokEnum.prototype.getMeta = function getMeta() {
  return this.meta
}

RokEnum.prototype.getMax = function getMax() {
  return this.max || Object.keys(this.valid).length
}

RokEnum.prototype.add = function add(name, value) {
  if ( value ) {
    this.valid[name] = value
  }
  else {
    this.valid[name] = true
  }
  this.enums.push({ name : name, value : value })
  this.notify()
}

RokEnum.prototype.del = function del(name) {
  delete this.valid[name]
  // ToDo: also remove from `this.enums`
  this.notify()
}

// returns the names of all enums that are valid (not the enums)
RokEnum.prototype.getAllValidNames = function getAllValidNames() {
  return Object.keys(this.valid)
}

// returns this list of all enum objects (which all have (name, value))
RokEnum.prototype.getAllEnums = function getAllEnums() {
  return this.enums
}

// returns the names of all enums selected (not the enums)
RokEnum.prototype.getAllSelected = function getAllSelected() {
  return Object.keys(this.selected)
}

// returns an object of { name : true, ... } names
RokEnum.prototype.getSelectedAsObj = function getSelectedAsObj() {
  var selected = {}
  Object.keys(this.selected).forEach(function(name) {
    selected[name] = true
  })
  return selected
}

// returns just the string of the one selected, or null if none are selected
RokEnum.prototype.getSelectedAsString = function getSelectedAsString() {
  if ( this.countSelected === 0 ) {
    return null
  }
  if ( this.countSelected > 1 ) {
    throw new Error("Rok.Enum: can't get selected as a string if more than one are selected")
  }

  return this.getAllSelected()[0]
}

RokEnum.prototype.isAllowed = function isAllowed(name) {
  return name in this.valid
}

// returns the { name : '...', value : ... } object
RokEnum.prototype.get = function get(name) {
  return this.valid[name]
}

RokEnum.prototype.isSet = function isSet(name) {
  return !!this.selected[name]
}

// returns the (meta) value stored with the enum
RokEnum.prototype.getSelected = function getSelected(name) {
  if ( !this.isAllowed(name) ) {
    throw new Error("RokEnum: trying to get a selected enum '" + name + "' for enum '" + this.name + "' which isn't valid")
  }

  // if selected, then return the enum value
  if ( this.selected[name] ) {
    return this.valid[name]
  }

  // not selected, just return null
  return null
}

RokEnum.prototype.countValid = function countValid() {
  return Object.keys(this.valid).length
}

RokEnum.prototype.countSelected = function countSelected() {
  return Object.keys(this.selected).length
}

RokEnum.prototype.set = function set(name) {
  // check that this val is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("RokEnum: name '" + name +  "' for enum '" + this.name + "' is not a valid enumeration")
  }

  // if this name is already set, do nothing and return
  if ( name in this.selected ) {
    return
  }

  // now check if we are trying to set too many
  if ( this.countSelected() + 1 > this.getMax() ) {
    throw new Error("RokEnum: trying to set too many selections (allowed: " + this.getMax() + ", currently: " + this.countSelected() + ")")
  }

  // all good
  this.selected[name] = true
  this.notify()
}

RokEnum.prototype.unset = function unset(name) {
  // check that this name is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("RokEnum: trying to unset name '" + name +  "' when it is not a valid enumeration")
  }

  // doesn't matter if this is already unset, just delete it anyway
  delete this.selected[name]
  this.notify()
}

RokEnum.prototype.toggle = function toggle(name) {
  // check that this name is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("RokEnum: trying to toggle name '" + name +  "' for enum '" + this.name + "' when it is not a valid enumeration")
  }

  // just call unset() or set() (which both emit 'notify')
  if ( name in this.selected ) {
    this.unset(name)
  }
  else {
    this.set(name)
  }
}

RokEnum.prototype.setTo = function setTo(name, to) {
  // check that this name is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("RokEnum: trying to setTo name '" + name +  "' for enum '" + this.name + "' when it is not a valid enumeration")
  }

  // just call unset() or set() (which both emit 'notify')
  if ( to ) {
    this.set(name)
  }
  else {
    this.unset(name)
  }
}

RokEnum.prototype.clearSelected = function clearSelected() {
  this.selected = {}
  this.notify()
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokEnum

// --------------------------------------------------------------------------------------------------------------------
