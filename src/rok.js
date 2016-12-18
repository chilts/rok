// --------------------------------------------------------------------------------------------------------------------

"use strict"

// --------------------------------------------------------------------------------------------------------------------

function Rok() {
  console.log('Rok: constructor')
  this.listeners = []
}

// return a list of props/store names (used in `reset()`, `extract()` and `restore()`)
Rok.prototype.props = function props() {
  return []
}
Rok.prototype.stores = function stores() {
  return []
}

// override this in your derived class so you can do something more specific
Rok.prototype._resetProps = function _resetProps() {
  // do nothing
}

// override this in your derived class so you can do something more specific
Rok.prototype._resetStores = function _resetStores() {
  this.stores().forEach(function(name) {
    this[name].reset()
  }.bind(this))
}

Rok.prototype.reset = function reset() {
  this._resetProps()
  this._resetStores()
  this.notify()
}

Rok.prototype.extract = function extract() {
  var data = {}

  // get a copy of all properties
  this.props().forEach(function(name) {
    data[name] = this[name]
  }.bind(this))

  // get a copy of all sub-stores
  this.stores().forEach(function(name) {
    data[name] = this[name].extract()
  }.bind(this))

  return data
}

Rok.prototype.restore = function restore(data) {
  // restore all properties
  this.props().forEach(function(name) {
    if ( typeof data[name] !== 'undefined' ) {
      this[name] = JSON.parse(JSON.stringify(data[name]))
    }
    else {
      // undefined
      this[name] = undefined
    }
  }.bind(this))

  // restore all sub-stores
  this.stores().forEach(function(name) {
    console.log('name=' + name)
    this[name].restore(data[name])
  }.bind(this))

  this.notify()
}

Rok.prototype.watch = function watch(fn) {
  this.listeners.push(fn)
}

Rok.prototype.unwatch = function unwatch(fn) {
  var indexOf = this.listeners.indexOf(fn)
  if ( indexOf === -1 ) {
    return
  }
  var a = this.listeners.splice(0, indexOf-1)
  var b = this.listeners.splice(indexOf, this.listeners.length - indexOf)
  return a.concat(b)
}

Rok.prototype.notify = function notify() {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i].call(this)
  }
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = Rok

// --------------------------------------------------------------------------------------------------------------------