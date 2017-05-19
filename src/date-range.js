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

var months = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]

// Source: http://stackoverflow.com/questions/497790
var dates = {
  convert: function(d) {
    // if we have nothing, return nothing
    if ( !d ) return null

    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year, month, day]. NOTE: month is 1-12.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp) 
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc, but not
    //                  "DD/MM/YYYY" since they don't like that.
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
        : null
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
    var mth = d.getUTCMonth() + 1
    var day = d.getUTCDate()
    var year = 1900 + d.getYear()
    return d ? '' + year + '-' + this.pad(mth) + '-' + this.pad(day) : ''
  },
  iso: function(d) {
    d = this.convert(d)
    var mth = d.getUTCMonth() + 1
    var day = d.getUTCDate()
    var year = 1900 + d.getYear()
    return d ? '' + year + '-' + this.pad(mth) + '-' + this.pad(day) : ''
  },
  title: function(d) {
    d = this.convert(d)
    var mth = d.getUTCMonth() + 1
    var day = d.getUTCDate()
    var year = 1900 + d.getYear()
    return d ? '' + this.pad(day) + '/' + this.pad(mth) + '/' + year : ''
  },
  pad: function(n) {
    if ( n < 10 ) {
      return '0' + n
    }
    return '' + n
  },
  isValidDDsMMsYYYY: function(str) {
    // is Valid DD/MM/YYYY or D/M/YYYY ?

    var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    var date
    if ( !m ) {
      return false
    }

    // make sure these are numbers (and if an invalid number, should end up being 0)
    var day = m[1] | 0
    var month = m[2] | 0
    var year = m[3] | 0

    if ( month < 1 || month > 12 ) {
      return false
    }

    if ( day < 1 || day > 31 ) {
      return false
    }

    // check for leap year day first
    if ( this.isLeapYear(year) ) {
      if ( month === 2 ) {
        return day <= 29
      }
    }

    // check against the regular months
    if ( day > months[month-1] ) {
      return false
    }

    return year + '-' + this.pad(month) + '-' + this.pad(day)
  },
  isLeapYear: function(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }
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

RokDateRange.prototype.type = function type() {
  return 'DateRange'
}

RokDateRange.prototype.props = function props() {
  return [ 'name', 'title', 'start', 'end', 'editStart', 'editEnd' ]
}

RokDateRange.prototype.objects = function props() {
  return [ 'opts', 'meta' ]
}

// Called by Rok.reset().
RokDateRange.prototype._resetProps = function _resetProps() {
  this.start = null
  this.end = null
  this.editStart = ''
  this.editEnd = ''
}

RokDateRange.prototype.getName = function getName() {
  return this.name
}

// shouldn't need to use this since it's set in the constructor
RokDateRange.prototype.setName = function setName(name) {
  this.name = name
  this.notify()
}

RokDateRange.prototype.getTitle = function getTitle() {
  return this.title
}

// shouldn't need to use this since it's set in the constructor
RokDateRange.prototype.setTitle = function setTitle(title) {
  this.title = title
  this.notify()
}

RokDateRange.prototype.getMeta = function getMeta() {
  return this.meta
}

// shouldn't need to use this since it's set in the constructor
RokDateRange.prototype.setTitle = function setTitle(title) {
  this.title = title
  this.notify()
}

// shouldn't need to use this since it's set in the constructor
RokDateRange.prototype.setOpts = function setOpts(opts) {
  this.opts = opts
  this.notify()
}

RokDateRange.prototype.getOpts = function getOpts() {
  return this.opts
}

// shouldn't need to use this since it's set in the constructor
RokDateRange.prototype.setMeta = function setMeta(meta) {
  this.meta = meta
  this.notify()
}

RokDateRange.prototype.getStart = function getStart() {
  return this.start
}

// If you provide a value that can't be converted to a date, `start` will be set to null. An error is returned if there
// was a problem. null is returned upon success.
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
    this.start = dates.iso(d)
    this.editStart = dates.title(d)
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
  this.start = dates.iso(d)
  this.editStart = dates.title(d)
  this.notify()
  return null
}

RokDateRange.prototype.getEnd = function getEnd() {
  return this.end
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
    this.end = dates.iso(d)
    this.editEnd = dates.title(d)
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
  this.end = dates.iso(d)
  this.editEnd = dates.title(d)
  this.notify()
  return null
}

RokDateRange.prototype.applyEditStart = function applyEditStart() {
  // okay, whatever we have in editStart, we need to set it into the start
  var str = this.editStart
  console.log('got start = ' + str)

  var iso = dates.isValidDDsMMsYYYY(str)
  if ( iso ) {
    this.start = iso
    this.editStart = dates.title(iso)
  }
  else {
    this.start = null
  }

  this.setStart(iso)
  this.notify()
}

RokDateRange.prototype.applyEditEnd = function applyEditEnd() {
  // okay, whatever we have in editEnd, we need to set it into the end
  var str = this.editEnd
  console.log('got end = ' + str)

  var iso = dates.isValidDDsMMsYYYY(str)
  if ( iso ) {
    this.end = iso
    this.editEnd = dates.title(iso)
  }
  else {
    this.end = null
  }

  this.notify()
}

RokDateRange.prototype.setEditStart = function setEditStart(str) {
  // always set what we've been given (exactly as they gave it)
  this.editStart = str
  console.log ('>> date=' + str)
  this.notify()
}

RokDateRange.prototype.getEditStart = function getEditStart() {
  return this.editStart
}

RokDateRange.prototype.setEditEnd = function setEditEnd(str) {
  // always set what we've been given (exactly as they gave it)
  this.editEnd = str
  console.log ('>> date=' + str)
  this.notify()
}

RokDateRange.prototype.getEditEnd = function getEditEnd() {
  return this.editEnd
}

RokDateRange.prototype.today = function today() {
  return dates.iso(new Date())
}

RokDateRange.prototype.min = function min(a, b) {
  a = dates.convert(a)
  b = dates.convert(b)
  if ( !a ) return dates.iso(b)
  if ( !b ) return dates.iso(a)
  if ( a.getTime() < b.getTime() ) {
    return dates.iso(a)
  }
  return dates.iso(b)
}

RokDateRange.prototype.max = function max(a, b) {
  a = dates.convert(a)
  b = dates.convert(b)
  if ( !a ) return dates.iso(b)
  if ( !b ) return dates.iso(a)
  if ( a.getTime() > b.getTime() ) {
    return dates.iso(a)
  }
  return dates.iso(b)
}

RokDateRange.prototype.isValidEditStart = function isValidEditStart() {
  if ( this.editStart === '' ) {
    return true
  }
  return dates.isValidDDsMMsYYYY(this.editStart)
}

RokDateRange.prototype.isValidEditEnd = function isValidEditEnd() {
  if ( this.editEnd === '' ) {
    return true
  }
  return dates.isValidDDsMMsYYYY(this.editEnd)
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = RokDateRange

// --------------------------------------------------------------------------------------------------------------------
