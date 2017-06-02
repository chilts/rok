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

  // also store valid names in an array so we can keep order
  this.names = []
}
inherits(RokEnum, Rok)

RokEnum.prototype.type = function type() {
  return 'Enum'
}

RokEnum.prototype.props = function props() {
  return [ 'name', 'title', 'max', ]
}

RokEnum.prototype.objects = function props() {
  return [ 'meta', 'valid', 'names', 'selected', ]
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
  if ( typeof value !== 'undefined' ) {
    this.valid[name] = value
  }
  else {
    this.valid[name] = true
  }

  // remember the name in an array too
  this.names.push(name)

  this.notify()
}

RokEnum.prototype.del = function del(name) {
  var indexOf = this.names.indexOf(name)
  if ( indexOf === -1 ) {
    // not in names anyway, so nothing to do
    return
  }

  // remove from `names`
  this.names = this.names.slice(0, indexOf).append(this.names.slice(indexOf+1))

  // remove from valid and selected (if there)
  delete this.valid[name]
  delete this.selected[name]

  this.notify()
}

// returns every name allowed (not the values), in sorted order
RokEnum.prototype.getAllValidNames = function getAllValidNames() {
  return Object.keys(this.valid).sort()
}

// returns an array of all { name : ..., value : ... }
RokEnum.prototype.getAll = function getAll() {
  var all = []

  this.names.forEach(function(name) {
    all.push({ name : name, value : this.valid[name] })
  }.bind(this))

  return all
}

// // returns this list of all values (all objects with both `name` and `value`)
// RokEnum.prototype.getAllValues = function getAllValues() {
//   return Object.values(this.valid).sort(function(a, b) {
//     return a.name > b.name
//   })
// }

RokEnum.prototype.getAllEnums = function getAllEnums() {
  console.warn('Rok.RokEnum.getAllValues: deprecated, use getAllValues instead')
  return this.getAllValues()
}

// returns the names of all selected
RokEnum.prototype.getAllSelected = function getAllSelected() {
  return Object.keys(this.selected).sort()
}

// returns an object of { name : value, ... } names
RokEnum.prototype.getSelectedAsObj = function getSelectedAsObj() {
  console.warn('Rok.RokEnum.getSelectedAsObj: deprecated')
  var selected = {}
  Object.keys(this.selected).forEach(function(name) {
    selected[name] = true
  })
  return selected
}

// returns just the string of the one selected, or null if none are selected
RokEnum.prototype.getSelectedNameAsString = function getSelectedNameAsString() {
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

// returns the { name : '...', value : ... } object
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
  this.selected[name] = this.valid[name]
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
    console.log('Unsetting ' + name)
    this.unset(name)
  }
  else {
    console.log('Setting ' + name)
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
