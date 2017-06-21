// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var test = require('tape')

// local
var Rok = require('../')

// --------------------------------------------------------------------------------------------------------------------

test('create a List', function(t) {
  t.plan(20)

  var s1 = new Rok.Set()

  t.equal(s1.type(), 'Set', '.type() is correct')
  t.equal(s1.getName(), '', 'name is correct')
  t.equal(s1.getTitle(), '', 'title is correct')
  t.deepEqual(s1.getOpts(), {}, 'opts is correct')
  t.deepEqual(s1.getMeta(), {}, 'meta is correct')

  s1.reset()

  t.equal(s1.type(), 'Set', '.type() is correct')
  t.equal(s1.getName(), '', 'name is correct')
  t.equal(s1.getTitle(), '', 'title is correct')
  t.deepEqual(s1.getOpts(), {}, 'opts is correct')
  t.deepEqual(s1.getMeta(), {}, 'meta is correct')

  var s2 = new Rok.Set('test', 'Test', { thing : true }, { title : 'Hello' })

  t.equal(s2.type(), 'Set', '.type() is correct')
  t.equal(s2.getName(), 'test', 'name is correct')
  t.equal(s2.getTitle(), 'Test', 'title is correct')
  t.deepEqual(s2.getOpts(), { thing : true }, 'opts is correct')
  t.deepEqual(s2.getMeta(), { title : 'Hello' }, 'meta is correct')

  s2.reset()

  t.equal(s2.type(), 'Set', '.type() is correct')
  t.equal(s2.getName(), 'test', 'name is correct')
  t.equal(s2.getTitle(), 'Test', 'title is correct')
  t.deepEqual(s2.getOpts(), { thing : true }, 'opts is correct')
  t.deepEqual(s2.getMeta(), { title : 'Hello' }, 'meta is correct')

  t.end()
})

test('query the empty set', function(t) {
  t.plan(7)

  var s = new Rok.Set('set', 'A Set')

  t.equal(s.count(), 0, "zero items in the set")

  t.deepEqual(s.getAll(), [], 'nothing returned (kv)')
  t.deepEqual(s.getAllNames(), [], 'nothing returned (names)')
  t.deepEqual(s.getAllValues(), [], 'nothing returned (values)')

  t.deepEqual(s.getUsingPrefix(''), [], 'nothing returned (kv)')
  t.deepEqual(s.getNamesUsingPrefix(''), [], 'nothing returned (names)')
  t.deepEqual(s.getValuesUsingPrefix(''), [], 'nothing returned (values)')

  t.end()
})

test('add some items', function(t) {
  t.plan(31)

  var s = new Rok.Set('set', 'A Set')

  t.equal(s.count(), 0, "zero items in the set")

  s.watch(function() {
    t.ok('yay')
  })

  s.add('Hello')

  t.equal(s.count(), 1, "one item in the set")

  t.deepEqual(s.getAll(), [ { name : 'Hello', value : true } ], 'one item returned (kv)')
  t.deepEqual(s.getAllNames(), [ 'Hello' ], 'one name (names)')
  t.deepEqual(s.getAllValues(), [ true ], 'one value (values)')

  t.deepEqual(s.getUsingPrefix('a'), [], 'nothing returned (kv)')
  t.deepEqual(s.getNamesUsingPrefix('a'), [], 'nothing returned (names)')
  t.deepEqual(s.getValuesUsingPrefix('a'), [], 'nothing returned (values)')

  t.deepEqual(s.getUsingPrefix('H'), [ { name : 'Hello', value : true } ], 'one item')
  t.deepEqual(s.getNamesUsingPrefix('H'), [ 'Hello' ], 'one name')
  t.deepEqual(s.getValuesUsingPrefix('H'), [ true ], 'one value')

  // empty prefix works just like getAll(), getNames(,) and getValues()
  t.deepEqual(s.getUsingPrefix(''), [ { name : 'Hello', value : true } ], 'one item')
  t.deepEqual(s.getNamesUsingPrefix(''), [ 'Hello' ], 'one name')
  t.deepEqual(s.getValuesUsingPrefix(''), [ true ], 'one value')

  s.add('World', 'Value')

  t.deepEqual(s.getAll(), [ { name : 'Hello', value : true }, { name : 'World', value : 'Value' } ], 'two items returned (kv)')
  t.deepEqual(s.getAllNames(), [ 'Hello', 'World' ], 'two names')
  t.deepEqual(s.getAllValues(), [ true, 'Value' ], 'two values')

  t.deepEqual(s.getUsingPrefix('a'), [], 'nothing returned (kv)')
  t.deepEqual(s.getNamesUsingPrefix('a'), [], 'nothing returned (names)')
  t.deepEqual(s.getValuesUsingPrefix('a'), [], 'nothing returned (values)')

  t.deepEqual(s.getUsingPrefix('H'), [ { name : 'Hello', value : true } ], 'one item')
  t.deepEqual(s.getNamesUsingPrefix('H'), [ 'Hello' ], 'one name')
  t.deepEqual(s.getValuesUsingPrefix('H'), [ true ], 'one value')

  t.deepEqual(s.getUsingPrefix('W'), [ { name : 'World', value : 'Value' } ], 'two items')
  t.deepEqual(s.getNamesUsingPrefix('W'), [ 'World' ], 'two names')
  t.deepEqual(s.getValuesUsingPrefix('W'), [ 'Value' ], 'two values')

  // empty prefix works just like getAll(), getNames(,) and getValues()
  t.deepEqual(s.getUsingPrefix(''), [ { name : 'Hello', value : true }, { name : 'World', value : 'Value' } ], 'two items returned (kv)')
  t.deepEqual(s.getNamesUsingPrefix(''), [ 'Hello', 'World' ], 'two names')
  t.deepEqual(s.getValuesUsingPrefix(''), [ true, 'Value' ], 'two values')

  t.end()
})

// --------------------------------------------------------------------------------------------------------------------
