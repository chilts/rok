// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokEnum(name, title, opts) {
  opts = opts || {}

  Rok.call(this)

  // simply call reset to set up our properties
  this.reset()

  // set some of the properties from the incoming args
  this.name  = name
  this.title = title
  this.meta  = opts.meta || null
  this.max   = opts.max || null

  // start off with empty 'valid' and 'selected'
  this.all = []
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
  return [ 'meta', 'all', 'valid', 'selected', 'names', ]
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
  this.all.push({ name : name, value : this.valid[name] })
  this.names.push(name)

  this.notify()
}

RokEnum.prototype.del = function del(name) {
  var indexOf = this.names.indexOf(name)
  if ( indexOf === -1 ) {
    // not in names anyway, so nothing to do
    return
  }

  // remove from `names` and 'all'
  this.names = this.names.slice(0, indexOf).append(this.names.slice(indexOf+1))
  this.all = this.all.slice(0, indexOf).append(this.all.slice(indexOf+1))

  // remove from valid and selected (if there)
  delete this.valid[name]
  delete this.selected[name]

  this.notify()
}

// just returns how many names/values that are allowed
RokEnum.prototype.count = function count() {
  return this.all.length
}

// --- validation ---

RokEnum.prototype.isAllowed = function isAllowed(name) {
  return name in this.valid
}

// returns every name allowed (not the values) unsorted
RokEnum.prototype.getAllValidNames = function getAllValidNames() {
  return this.names
}

// gets all the valid values
RokEnum.prototype.getAllValidValues = function getAllValidValues() {
  return this.all.map(function(i) {
    return i.value
  })
}

// returns an array of all { name : ..., value : ... }
RokEnum.prototype.getAllValid = function getAll() {
  return this.all
}

// don't need a 'getName' (and besides, that function name already exists for the enum name)

// returns the value for this name
RokEnum.prototype.getValue = function getValue(name) {
  // check this is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("Rok.Enum.getValue: name '" + name +  "' for enum '" + this.name + "' is not a valid enumeration")
  }

  return this.valid[name]
}

// returns the { name : ..., value : ... } for this name
RokEnum.prototype.get = function get(name) {
  // check this is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("Rok.Enum.get: name '" + name +  "' for enum '" + this.name + "' is not a valid enumeration")
  }

  return { name : name, value : this.valid[name] }
}

// --- get/set ---

RokEnum.prototype.set = function set(name) {
  // check this is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("Rok.Enum.set: name '" + name +  "' for enum '" + this.name + "' is not a valid enumeration")
  }

  // if this name is already set, do nothing and return
  if ( name in this.selected ) {
    return
  }

  // now check if we are trying to set too many
  if ( this.countSelected() + 1 > this.getMax() ) {
    throw new Error("RokEnum: trying to set too many selections (allowed: " + this.getMax() + ", currently: " + this.countSelected() + ")")
  }

  console.log(this.selected)

  // all good
  this.selected[name] = true
  console.log(this.selected)
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

// returns true/false
RokEnum.prototype.isSet = function isSet(name) {
  return !!this.selected[name]
}

// --- selected ---

RokEnum.prototype.countSelected = function countSelected() {
  return Object.keys(this.selected).length
}

// returns an array of names of all selected unsorted
RokEnum.prototype.getAllSelectedNames = function getAllSelectedNames() {
  return Object.keys(this.selected)
}

// returns an array of values of all selected unsorted
RokEnum.prototype.getAllSelectedValues = function getAllSelectedValues() {
  return Object.keys(this.selected).map(function(name) {
    return this.valid[name]
  }.bind(this))
}

// returns an array of { name : ..., value : ... } of all selected unsorted
RokEnum.prototype.getAllSelected = function getAllSelected() {
  return Object.keys(this.selected).map(function(name) {
    return { name : name, value : this.valid[name] }
  }.bind(this))
}

// --- helper functions when you know there will be zero or at most one selected ---

// returns the selected name
RokEnum.prototype.getSelectedName = function getSelectedName() {
  var countSelected = this.countSelected()
  if ( countSelected === 0 ) {
    return null
  }
  if ( countSelected > 1 ) {
    throw new Error("Rok.Enum: can't get selected as a single name if more than one are selected")
  }

  return Object.keys(this.selected)[0]
}

// returns the selected value only
RokEnum.prototype.getSelectedValue = function getSelectedValue() {
  var countSelected = this.countSelected()
  if ( countSelected === 0 ) {
    return null
  }
  if ( countSelected > 1 ) {
    throw new Error("Rok.Enum: can't get selected as a single value if more than one are selected")
  }

  var name = Object.keys(this.selected)[0]
  return this.valid[name]
}

// returns the selected { name : ..., value : ... } only
RokEnum.prototype.getSelected = function getSelected() {
  var countSelected = this.countSelected()
  if ( countSelected === 0 ) {
    return null
  }
  if ( countSelected > 1 ) {
    throw new Error("Rok.Enum: can't get selected as a single value if more than one are selected")
  }

  var name = Object.keys(this.selected)[0]
  return{ name : name, value : this.valid[name] }
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokEnum

// --------------------------------------------------------------------------------------------------------------------
