// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

var C_INCLUDE = 'include'
var C_EXCLUDE = 'exclude'
var C_IGNORE  = 'ignore'

function RokEnumTri(name, title, opts, meta) {
  Rok.call(this)

  // set some of the properties from the incoming args
  this.name  = name
  this.title = title
  this.opts  = opts || {}
  this.meta  = meta || {}

  // start off with empty 'valid' and add to an array so we have an ordering/list
  this.valid = {}
  this.names = []

  // start with empty include, exclude, and ignore
  this.include = {}
  this.exclude = {}
  this.ignore = {}

  // simply call reset to set up our properties
  this.reset()
}

inherits(RokEnumTri, Rok)

RokEnumTri.prototype.type = function type() {
  return 'EnumTri'
}

RokEnumTri.prototype.props = function props() {
  return [ 'name', 'title' ]
}

RokEnumTri.prototype.objects = function props() {
  return [ 'opts', 'meta', 'valid', 'names', 'include', 'exclude', 'ignore' ]
}

// Called by Rok.reset().
RokEnumTri.prototype._resetProps = function _resetProps() {
  // reset all `this.include`/`this.exclude`, but make sure `this.ignore` has all of them
  this.include = {}
  this.exclude = {}
  this.ignore = {}
  Object.keys(this.valid).forEach(function(name) {
    this.ignore[name] = this.valid[name]
  }.bind(this))
}

RokEnumTri.prototype.getName = function getName() {
  return this.name
}

RokEnumTri.prototype.getTitle = function getTitle() {
  return this.title
}

RokEnumTri.prototype.setTitle = function setTitle(title) {
  this.title = title
  this.notify()
}

RokEnumTri.prototype.setOpts = function setOpts(opts) {
  this.opts = opts || {}
  this.notify()
}

RokEnumTri.prototype.getOpts = function getOpts() {
  return this.opts
}

RokEnumTri.prototype.setMeta = function setMeta(meta) {
  this.meta = meta || {}
  this.notify()
}

RokEnumTri.prototype.getMeta = function getMeta() {
  return this.meta
}

RokEnumTri.prototype.add = function add(name, value) {
  if ( typeof value !== 'undefined' ) {
    this.valid[name] = value
  }
  else {
    this.valid[name] = true
  }

  // add to the list of names
  this.names.push(name)

  // the starting state is `ignore`
  this.ignore[name] = this.valid[name]

  this.notify()
}

RokEnumTri.prototype.del = function del(name) {
  var indexOf = this.enums.indexOf(name)
  if ( indexOf === -1 ) {
    // not in enums anyway, so nothing to do
    return
  }

  // remove from `enums`
  this.names = this.names.slice(0, indexOf).append(this.names.slice(indexOf+1))

  // remove from valid, include, exclude, and ignore (if there)
  delete this.valid[name]
  delete this.include[name]
  delete this.exclude[name]
  delete this.ignore[name]

  this.notify()
}

// returns the names of all enums that are valid (not the enums)
RokEnumTri.prototype.getAllValidNames = function getAllValidNames() {
  return Object.keys(this.valid).sort()
}

// returns the names of all ignored (not the values)
RokEnumTri.prototype.getAllIncludedNames = function getAllIncludedNames() {
  return Object.keys(this.include).sort()
}

// returns the names of all excluded (not the values)
RokEnumTri.prototype.getAllExcludedNames = function getAllExcludedNames() {
  return Object.keys(this.exclude).sort()
}

// returns the names of all ignored (not the values)
RokEnumTri.prototype.getAllIgnoredNames = function getAllIgnoredNames() {
  return Object.keys(this.ignore).sort()
}

RokEnumTri.prototype.isAllowed = function isAllowed(name) {
  return name in this.valid
}

// returns the { name : '...', value : ... } object
RokEnumTri.prototype.get = function get(name) {
  return this.valid[name]
}

RokEnumTri.prototype.isIncluded = function isIncluded(name) {
  return name in this.include
}

RokEnumTri.prototype.isExcluded = function isExcluded(name) {
  return name in this.exclude
}

RokEnumTri.prototype.isIgnored = function isIgnored(name) {
  return name in this.ignore
}

RokEnumTri.prototype.countValid = function countValid() {
  return Object.keys(this.valid).length
}

RokEnumTri.prototype.countIncluded = function countIcluded() {
  return Object.keys(this.include).length
}

RokEnumTri.prototype.countExcluded = function countExcluded() {
  return Object.keys(this.exclude).length
}

RokEnumTri.prototype.countIgnored = function countIgnored() {
  return Object.keys(this.ignore).length
}

RokEnumTri.prototype.setInclude = function setInclude(name) {
  // check that this val is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("Rok.EnumTri.include: name '" + name +  "' for enum '" + this.name + "' is not a valid name")
  }

  // if this name is already set, do nothing and return
  if ( name in this.include ) {
    return
  }

  this.include[name] = this.valid[name]
  delete this.exclude[name]
  delete this.ignore[name]
  this.notify()
}

RokEnumTri.prototype.setExclude = function setExclude(name) {
  // check that this val is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("Rok.EnumTri.exclude: name '" + name +  "' for enum '" + this.name + "' is not a valid name")
  }

  // if this name is already set, do nothing and return
  if ( name in this.exclude ) {
    return
  }

  delete this.include[name]
  this.exclude[name] = this.valid[name]
  delete this.ignore[name]
  this.notify()
}

RokEnumTri.prototype.setIgnore = function setIgnore(name) {
  // check that this val is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("Rok.EnumTri.ignore: name '" + name +  "' for enum '" + this.name + "' is not a valid name")
  }

  // if this name is already set, do nothing and return
  if ( name in this.ignore ) {
    return
  }

  // all good
  delete this.include[name]
  delete this.exclude[name]
  this.ignore[name] = this.valid[name]
  this.notify()
}

RokEnumTri.prototype.set = function set(name, to) {
  // check that this name is valid
  if ( !this.isAllowed(name) ) {
    throw new Error("Rok.EnumTri.set: name '" + name +  "' for enum '" + this.name + "' is not a valid name")
  }

  // check that 'to' is 'include', 'exclude', or 'ignore'
  if ( to !== C_INCLUDE && to !== C_EXCLUDE && to !== C_INCLUDE ) {
    throw new Error("Rok.EnumTri.set: invalid 'to' (" + ( to || '[undefined]' ) + "), should be one of :", [ C_INCLUDE, C_EXCLUDE, C_IGNORE ].join(', '))
  }

  delete this.include[name]
  delete this.exclude[name]
  delete this.ignore[name]

  if ( to === C_INCLUDE ) {
    this.include[name] = this.valid[name]
  }
  if ( to === C_EXCLUDE ) {
    this.exclude[name] = this.valid[name]
  }
  if ( to === C_IGNORE ) {
    this.ignore[name] = this.valid[name]
  }

  this.notify()
}

RokEnumTri.C_INCLUDE = C_INCLUDE
RokEnumTri.C_EXCLUDE = C_EXCLUDE
RokEnumTri.C_IGNORE  = C_IGNORE

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokEnumTri

// --------------------------------------------------------------------------------------------------------------------
