// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var inherits = require('inherits')

// local
var Rok = require('./rok.js')

// --------------------------------------------------------------------------------------------------------------------

var errInvalidDate = new Error("Invalid date")
var errInvalidStart = new Error("Invalid start date, it should be before or equal to end")
var errInvalidEnd = new Error("Invalid end date, it should be equal to or after start")

// Source: http://stackoverflow.com/questions/497790
var dates = {
  convert: function(d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year, month, day]. NOTE: month is 1-12.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp) 
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes. NOTE: month is 1-12
    return (
      d.constructor === Date
        ? d
        : d.constructor === Array
        ? new Date(d[0], d[1]-1, d[2])
        : d.constructor === Number
        ? new Date(d)
        : d.constructor === String
        ? new Date(d)
        : typeof d === "object"
        ? new Date(d.year, d.month - 1, d.date)
        : NaN
    );
  },
  compare: function(a, b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(a = this.convert(a).valueOf()) && isFinite(b = this.convert(b).valueOf())
        ?
        (a > b) - (a < b)
        :
        NaN
    );
  },
  inRange: function(start, end, d) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(d = this.convert(d).valueOf())
        && isFinite(start = this.convert(start).valueOf())
        && isFinite(end = this.convert(end).valueOf())
        ?
        start <= d && d <= end
        :
        NaN
    );
  },
  string: function(d) {
    d = this.convert(d)
    var m = d.getUTCMonth() + 1
    var day = d.getUTCDate()
    return d ? '' + (1900 + d.getYear()) + '-' + ( m < 10 ? '0' + m : m ) + '-' + ( day < 10 ? '0' + day : day ) : null
  },
}

// --------------------------------------------------------------------------------------------------------------------

function RokDateRange(name, title, opts, meta) {
  Rok.call(this)

  // simply call reset to set up our properties
  this.reset()

  // set some of the properties from the incoming args
  this.name = name
  this.title = title

  // currently there are no opts that we use
  this.opts = opts || {}

  // just remember the meta without interpreting it in any way
  this.meta = meta || {}
}
inherits(RokDateRange, Rok)

RokDateRange.prototype.props = function props() {
  return [ 'name', 'title', 'start', 'end' ]
}

RokDateRange.prototype.objects = function props() {
  return [ 'meta', 'data' ]
}

// Called by Rok.reset().
RokDateRange.prototype._resetProps = function _resetProps() {
  this.start = null
  this.end = null
  this.data = {}
}

RokDateRange.prototype.getName = function getName() {
  return this.name
}

RokDateRange.prototype.setName = function setName(name) {
  this.name = name
  this.notify()
}

RokDateRange.prototype.getTitle = function getTitle() {
  return this.title
}

RokDateRange.prototype.setTitle = function setTitle(title) {
  this.title = title
  this.notify()
}

RokDateRange.prototype.getMeta = function getMeta() {
  return this.meta
}

RokDateRange.prototype.getStart = function getStart() {
  return this.start
}

RokDateRange.prototype.getEnd = function getEnd() {
  return this.end
}

RokDateRange.prototype.getData = function getData() {
  return this.data
}

// If you provide a value that can't be converted to a date, `start` will be set to null. An error is returned if there
// was a problem. null is return upon success.
RokDateRange.prototype.setStart = function setStart(start) {
  var d = dates.convert(start)
  console.log('d:' + d)

  // check this date is valid
  if ( isNaN(d) ) {
    this.start = null
    this.notify()
    return errInvalidDate
  }

  // if there is no end date, then we don't need to compare
  if ( !this.end ) {
    this.start = dates.string(d)
    this.notify()
    return null
  }

  // check the date is less than or equal to end
  if ( dates.compare(d, this.end) === 1 ) {
    this.start = null
    this.notify()
    return errInvalidStart
  }

  // all good
  this.start = dates.string(d)
  this.notify()
  return null
}

// If you provide a value that can't be converted to a date, `end` will be set to null. An error is returned if there
// was a problem. null is return upon success.
RokDateRange.prototype.setEnd = function setEnd(end) {
  var d = dates.convert(end)
  console.log('d:' + d)

  // check this date is valid
  if ( isNaN(d) ) {
    this.end = null
    this.notify()
    return errInvalidDate
  }

  // if there is no start date, then we don't need to compare
  if ( !this.start ) {
    this.end = dates.string(d)
    this.notify()
    return null
  }

  // check the date is greater than or equal to start
  if ( dates.compare(this.start, d) === 1 ) {
    this.end = null
    this.notify()
    return errInvalidEnd
  }

  // all good
  this.end = dates.string(d)
  this.notify()
  return null
}

// Data is just a grab bag of properties you want to store with the date range.
RokDateRange.prototype.setData = function setEnd(key, val) {
  this.data[key] = val
  this.notify()
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokDateRange

// --------------------------------------------------------------------------------------------------------------------
