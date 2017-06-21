// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokSet(name, title, opts, meta) {
  Rok.call(this)

  // set some of the properties from the incoming args
  this.name  = name || ''
  this.title = title || ''

  // save the meta info
  this.opts = opts || {}
  this.meta = meta || {}

  // simply call reset to set up our properties and objects
  this.reset()
}

inherits(RokSet, Rok)

RokSet.prototype.type = function type() {
  return 'Set'
}

RokSet.prototype.props = function props() {
  return []
}

RokSet.prototype.objects = function objects() {
  return [ 'set' ]
}

// Called by Rok.reset().
RokSet.prototype._resetObjects = function _resetObjects() {
  // just reset 'set'
  this.set = {}
}

RokSet.prototype.getName = function getName() {
  return this.name
}

RokSet.prototype.getTitle = function getTitle() {
  return this.title
}

RokSet.prototype.getMeta = function getMeta() {
  return this.meta
}

RokSet.prototype.getOpts = function getOpts(meta) {
  return this.opts
}

// returns the actual set, so be careful not to change it
RokSet.prototype.getSet = function getSet() {
  return this.set
}

// --------------------------------------------------------------------------------------------------------------------
// manipulation

RokSet.prototype.add = function add(name, value) {
  this.set[name] = value || true
  this.notify()
}

RokSet.prototype.del = function del(name) {
  delete this.set[name]
  this.notify()
}

// returns [ { name : ..., value : ... }, ... ]
RokSet.prototype.getAll = function getAll() {
  return Object.keys(this.set).map(function(name) {
    return {
      name  : name,
      value : this.set[name],
    }
  }.bind(this))
}

RokSet.prototype.getAllNames = function getAllNames() {
  return Object.keys(this.set)
}

RokSet.prototype.getAllValues = function getAllValues() {
  return Object.keys(this.set).map(function(name) {
    return this.set[name]
  }.bind(this))
}

// returns a [ name, ... ]
RokSet.prototype.getNamesUsingPrefix = function getNamesUsingPrefix(prefix) {
  return Object.keys(this.set).filter(function(name) { 
    // Check if the name starts with prefix. See
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
    // for this technique.
    return name.substr(0, prefix.length) === prefix
  })
}

// returns a [ { name : ..., value : ... }, ... ]
RokSet.prototype.getUsingPrefix = function getNamesUsingPrefix(prefix) {
  return this.getNamesUsingPrefix(prefix).map(function(name) {
    return {
      name  : name,
      value : this.set[name],
    }
  }.bind(this))
}

// returns a [ value, ... ]
RokSet.prototype.getValuesUsingPrefix = function getValuesUsingPrefix(prefix) {
  return this.getNamesUsingPrefix(prefix).map(function(name) {
    return this.set[name]
  }.bind(this))
}

// just returns how many names are set
RokSet.prototype.count = function count() {
  return Object.keys(this.set).length
}

// returns true/false
RokSet.prototype.isInSet = function isInSet(name) {
  return name in this.set
}

RokSet.prototype.get = function get(name) {
  if ( !(name in this.set) ) return null

  return {
    name  : name,
    value : this.set[name],
  }
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokSet

// --------------------------------------------------------------------------------------------------------------------
