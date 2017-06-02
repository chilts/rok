// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var test = require('tape')

// local
var Rok = require('../')

// --------------------------------------------------------------------------------------------------------------------

test('create an EnumTri', function(t) {
  t.plan(2)

  var e = new Rok.EnumTri('test', 'Test')

  t.equal(e.getName(), 'test', 'name is correct')
  t.equal(e.getTitle(), 'Test', 'title is correct')

  t.end()
})

test('add some values and check each set', function(t) {
  t.plan(12)

  var e = new Rok.EnumTri('test', 'Test')

  e.add('red')
  e.add('green')
  e.add('blue')

  // allowed
  t.equal(e.isAllowed('red'), true, 'red is allowed')
  t.equal(e.isAllowed('green'), true, 'green is allowed')
  t.equal(e.isAllowed('blue'), true, 'blue is allowed')
  t.equal(e.isAllowed('black'), false, 'black is not allowed')
  t.equal(e.isAllowed('yellow'), false, 'yellow is not allowed')

  // names
  t.deepEqual(e.getAllValidNames(), [ 'blue', 'green', 'red' ], 'valid names are correct')
  t.deepEqual(e.getAllIncludedNames(), [ ], 'included names are correct')
  t.deepEqual(e.getAllExcludedNames(), [ ], 'excluded names are correct')
  t.deepEqual(e.getAllIgnoredNames(), [ 'blue', 'green', 'red' ], 'ignorednames are correct')

  // ignored
  t.equal(e.isIgnored('red'), true, 'red is ignored')
  t.equal(e.isIgnored('green'), true, 'green is ignored')
  t.equal(e.isIgnored('blue'), true, 'blue is ignored')

  t.end()
})

test('test include/exclude/ignore', function(t) {
  t.plan(13)

  var e = new Rok.EnumTri('test', 'Test')

  e.add('red')
  e.add('green')
  e.add('blue')

  e.setInclude('red')
  e.setExclude('green')

  // names
  t.deepEqual(e.getAllIncludedNames(), [ 'red' ], 'included names are correct')
  t.deepEqual(e.getAllExcludedNames(), [ 'green' ], 'excluded names are correct')
  t.deepEqual(e.getAllIgnoredNames(), [ 'blue' ], 'ignorednames are correct')

  e.setInclude('green')
  e.setIgnore('red')

  // names
  t.deepEqual(e.getAllIncludedNames(), [ 'green' ], 'included names are correct')
  t.deepEqual(e.getAllExcludedNames(), [ ], 'excluded names are correct')
  t.deepEqual(e.getAllIgnoredNames(), [ 'blue', 'red' ], 'ignorednames are correct')

  e.set('blue', Rok.EnumTri.C_INCLUDE)
  e.set('red', Rok.EnumTri.C_EXCLUDE)

  // names
  t.deepEqual(e.getAllIncludedNames(), [ 'blue', 'green' ], 'included names are correct')
  t.deepEqual(e.getAllExcludedNames(), [ 'red' ], 'excluded names are correct')
  t.deepEqual(e.getAllIgnoredNames(), [ ], 'ignorednames are correct')

  // reset
  e.reset()

  // names
  t.deepEqual(e.getAllValidNames(), [ 'blue', 'green', 'red' ], 'valid names are correct')
  t.deepEqual(e.getAllIncludedNames(), [ ], 'included names are correct')
  t.deepEqual(e.getAllExcludedNames(), [ ], 'excluded names are correct')
  t.deepEqual(e.getAllIgnoredNames(), [ 'blue', 'green', 'red' ], 'ignorednames are correct')

  t.end()
})

// --------------------------------------------------------------------------------------------------------------------
