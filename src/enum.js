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
  // also store 'valid' values in an array so we can keep order
  this.values = []
}
inherits(RokEnum, Rok)

RokEnum.prototype.props = function props() {
  return [ 'name', 'title', 'max', ]
}

RokEnum.prototype.objects = function props() {
  return [ 'meta', 'valid', 'values', 'selected', ]
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

  RokEnum.prototype.add = function add(val, meta) {
    if ( meta ) {
      this.valid[val] = meta
    }
    else {
      this.valid[val] = true
    }
    this.values.push({ val : val, meta : meta })
    this.notify()
  }

  RokEnum.prototype.del = function del(val) {
    delete this.valid[val]
    this.notify()
  }

  // returns the names of all enums that are valid (not the values)
  RokEnum.prototype.getAllValid = function getAllValid() {
    return Object.keys(this.valid)
  }

  RokEnum.prototype.getAllValues = function getAllValues() {
    return this.values
  }

  // returns the names of all enums selected (not the values)
  RokEnum.prototype.getAllSelected = function getAllSelected() {
    return Object.keys(this.selected)
  }

  // returns an object of { name : true, ... } values
  RokEnum.prototype.getSelectedAsObj = function getSelectedAsObj() {
    var selected = {}
    Object.keys(this.selected).forEach(function(name) {
      selected[name] = true
    })
    return selected
  }

  RokEnum.prototype.isAllowed = function isAllowed(val) {
    return val in this.valid
  }

  RokEnum.prototype.getValid = function getValid(val) {
    return this.valid[val]
  }

  RokEnum.prototype.isSet = function isSet(val) {
    return !!this.selected[val]
  }

  // returns the (meta) value stored with the enum
  RokEnum.prototype.getSelected = function getSelected(val) {
    if ( !this.isAllowed(val) ) {
      throw new Error("RokEnum: trying to get a selected value '" + val + "' which isn't valid")
    }

    // if selected, then return the enum value
    if ( this.selected[val] ) {
      return this.valid[val]
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

  RokEnum.prototype.set = function set(val) {
    // check that this val is valid
    if ( !this.isAllowed(val) ) {
      throw new Error("RokEnum: value '" + val +  "' for enum '" + this.name + "' is not a valid enumeration")
    }

    // if this value is already set, do nothing and return
    if ( val in this.selected ) {
      return
    }

    // now check if we are trying to set too many
    if ( this.countSelected() + 1 > this.getMax() ) {
      throw new Error("RokEnum: trying to set too many selections (allowed: " + this.getMax() + ", currently: " + this.countSelected() + ")")
    }

    // all good
    this.selected[val] = true
    this.notify()
  }

  RokEnum.prototype.unset = function unset(val) {
    // check that this val is valid
    if ( !this.isAllowed(val) ) {
      throw new Error("RokEnum: trying to unset value '" + val +  "' when it is not a valid enumeration")
    }

    // doesn't matter if this is already unset, just delete it anyway
    delete this.selected[val]
    this.notify()
  }

  RokEnum.prototype.toggle = function toggle(val) {
    // check that this val is valid
    if ( !this.isAllowed(val) ) {
      throw new Error("RokEnum: trying to toggle value '" + val +  "' when it is not a valid enumeration")
    }

    // just call unset() or set() (which both emit 'update')
    if ( val in this.selected ) {
      this.unset(val)
    }
    else {
      this.set(val)
    }
  }

  RokEnum.prototype.setTo = function setTo(val, to) {
    // check that this val is valid
    if ( !this.isAllowed(val) ) {
      throw new Error("RokEnum: trying to setTo value '" + val +  "' when it is not a valid enumeration")
    }

    // just call unset() or set() (which both emit 'update')
    if ( to ) {
      this.set(val)
    }
    else {
      this.unset(val)
    }
  }

  RokEnum.prototype.clearSelected = function clearSelected() {
    this.selected = {}
    this.notify()
  }

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokEnum

// --------------------------------------------------------------------------------------------------------------------
