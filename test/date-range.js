// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var test = require('tape')

// local
var Rok = require('../')

// --------------------------------------------------------------------------------------------------------------------

test('create a DateRange', function(t) {
  t.plan(18)

  var d1 = new Rok.DateRange('status', 'Status')
  t.equal(d1.type(), 'DateRange', '.type() is correct')
  t.equal(d1.getName(), 'status', 'name is correct')
  t.equal(d1.getTitle(), 'Status', 'title is correct')
  t.deepEqual(d1.getOpts(), {}, 'opts is correct')
  t.deepEqual(d1.getMeta(), {}, 'meta is correct')
  t.equal(d1.getStart(), null, 'start is correct')
  t.equal(d1.getEnd(), null, 'end is correct')
  t.equal(d1.getEditStart(), '', 'editStart is correct')
  t.equal(d1.getEditEnd(), '', 'editEnd is correct')

  var d2 = new Rok.DateRange()
  t.equal(d2.type(), 'DateRange', '.type() is correct')
  t.equal(d2.getName(), '', 'name is correct')
  t.equal(d2.getTitle(), '', 'title is correct')
  t.deepEqual(d2.getOpts(), {}, 'opts is correct')
  t.deepEqual(d2.getMeta(), {}, 'meta is correct')
  t.equal(d2.getStart(), null, 'start is correct')
  t.equal(d2.getEnd(), null, 'end is correct')
  t.equal(d2.getEditStart(), '', 'editStart is correct')
  t.equal(d2.getEditEnd(), '', 'editEnd is correct')

  t.end()
})

test('set/get some fields', function(t) {
  t.plan(4)

  var d = new Rok.DateRange('status', 'Status')

  d.setStart('2006-01-02')
  d.setEnd('2006-11-12')
  d.setEditStart('2016-01-02')
  d.setEditEnd('2016-11-12')

  t.equal(d.getStart(), '2006-01-02', 'start was set correctly')
  t.equal(d.getEnd(), '2006-11-12', 'end was set correctly')
  t.equal(d.getEditStart(), '2016-01-02', 'editStart was set correctly')
  t.equal(d.getEditStart(), '2016-11-12', 'editEnd was set correctly')

  t.end()
})

test('query some fields', function(t) {
  t.plan(20)

  var d = new Rok.DateRange('status', 'Status')

  t.equal(d.hasStart(), false, 'no start currently')
  t.equal(d.hasEnd(), false, 'no end currently')
  t.equal(d.hasEither(), false, 'no start or end currently')
  t.equal(d.hasBoth(), false, 'no start and end currently')

  d.setStart('2006-01-02')

  t.equal(d.hasStart(), true, 'we now have a start')
  t.equal(d.hasEnd(), false, 'still no end')
  t.equal(d.hasEither(), true, 'we have a start so either is now true')
  t.equal(d.hasBoth(), false, 'do not have both so still false')

  d.setEnd('2006-11-12')

  t.equal(d.hasStart(), true, 'we now have a start')
  t.equal(d.hasEnd(), true, 'we now have a end')
  t.equal(d.hasEither(), true, 'we now have a start or end')
  t.equal(d.hasBoth(), true, 'we now have a start and end')

  d.removeStart()

  t.equal(d.hasStart(), false, 'no start anymore')
  t.equal(d.hasEnd(), true, 'has an end date')
  t.equal(d.hasEither(), true, 'now just an end')
  t.equal(d.hasBoth(), false, 'do not have both again')

  d.removeEnd()

  t.equal(d.hasStart(), false, 'back to no start')
  t.equal(d.hasEnd(), false, 'back to no end')
  t.equal(d.hasEither(), false, 'back to no start or end')
  t.equal(d.hasBoth(), false, 'back to no start and end')

  t.end()
})

// --------------------------------------------------------------------------------------------------------------------
