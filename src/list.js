// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

function RokList(name, title, opts, meta) {
  Rok.call(this)

  // set some of the properties from the incoming args
  this.name  = name || ''
  this.title = title || ''

  // save the meta info
  this.opts = opts || {}
  this.meta = meta || {}

  // keep a list of the original values AND the current list
  this.orig = []
  this.list = []

  // simply call reset to set up our properties
  this.reset()
}
inherits(RokList, Rok)

RokList.prototype.type = function type() {
  return 'List'
}

RokList.prototype.props = function props() {
  return [ 'name', 'title' ]
}

RokList.prototype.objects = function props() {
  return [ 'opts', 'meta', 'list', 'orig' ]
}

// Called by Rok.reset().
RokList.prototype._resetObjects = function _resetObjects() {
  // don't reset `opts`, `meta`, or `orig`

  // reset `list` from `orig`
  this.list = JSON.parse(JSON.stringify(this.orig))
}

// --- type fields ---

RokList.prototype.getName = function getName() {
  return this.name
}

RokList.prototype.getTitle = function getTitle() {
  return this.title
}

RokList.prototype.getOpts = function getOpts() {
  return this.opts
}

RokList.prototype.getMeta = function getMeta() {
  return this.meta
}

// --- value fields ---

// take from back - returns item
RokList.prototype.pop = function pop() {
  var item = this.list.pop()
  this.orig.pop()
  this.notify()
  return item
}

// add to back - returns new length
RokList.prototype.push = function push(item) {
  var len = this.list.push(JSON.parse(JSON.stringify(item)))
  this.orig.push(JSON.parse(JSON.stringify(item)))
  this.notify()
  return len
}

// take from front - returns the item
RokList.prototype.shift = function shift() {
  var item = this.list.shift()
  this.orig.shift()
  this.notify()
  return item
}

// add to front - returns new length
RokList.prototype.unshift = function unshift(item) {
  var len = this.list.unshift(JSON.parse(JSON.stringify(item)))
  this.orig.unshift(JSON.parse(JSON.stringify(item)))
  this.notify()
  return len
}

// modify an index with a new item
RokList.prototype.setItem = function setItem(index, item) {
  this.list[index] = JSON.parse(JSON.stringify(item))
  this.notify()
}

// modify an index with a key/value
RokList.prototype.setItemKey = function setItemKey(index, key, value) {
  this.list[index][key] = value
  this.notify()
}

// remove an index with a key
RokList.prototype.removeItemKey = function setItemKey(index, key) {
  delete this.list[index][key]
  this.notify()
}

// --- get the list items in a particular way ---

RokList.prototype.count = function count() {
  return this.list.length
}

RokList.prototype.getList = function list() {
  return this.list
}

RokList.prototype.filter = function filter(key, value) {
  return this.list.filter(function(item) {
    return item[key] === value
  })
}

RokList.prototype.filterHasKey = function filterHasKey(key) {
  return this.list.filter(function(item) {
    return key in item
  })
}

RokList.prototype.filterHasNoKey = function filterHasNoKey(key) {
  return this.list.filter(function(item) {
    return !(key in item)
  })
}

RokList.prototype.sort = function sort(key) {
  return this.list.sort(function(a, b) {
    return b[key] < a[key]
  })
}

RokList.prototype.findIndex = function findIndex(key, value) {
  return this.list.findIndex(function(item) {
    return item[key] === value
  })
}

RokList.prototype.find = function find(key, value) {
  return this.list.find(function(item) {
    return item[key] === value
  })
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokList

// --------------------------------------------------------------------------------------------------------------------
