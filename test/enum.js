// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var test = require('tape')

// local
var Rok = require('../')

// --------------------------------------------------------------------------------------------------------------------

var red =   { title : 'Red'   }
var green = { title : 'Green' }
var blue =  { title : 'Blue'  }

test('create an Enum', function(t) {
  t.plan(2)

  var e = new Rok.Enum('test', 'Test')

  t.equal(e.getName(), 'test', 'name is correct')
  t.equal(e.getTitle(), 'Test', 'title is correct')

  t.end()
})

test('add some values and check each set', function(t) {
  t.plan(23)

  var e = new Rok.Enum('test', 'Test', { max : 1 })

  t.equal(e.count(), 0, 'zero values')
  e.add('red', red)
  t.equal(e.count(), 1, 'one value')
  e.add('green', green)
  t.equal(e.count(), 2, 'two values')
  e.add('blue', blue)
  t.equal(e.count(), 3, 'three values')

  // allowed
  t.equal(e.isAllowed('red'), true, 'red is allowed')
  t.equal(e.isAllowed('green'), true, 'green is allowed')
  t.equal(e.isAllowed('blue'), true, 'blue is allowed')
  t.equal(e.isAllowed('black'), false, 'black is not allowed')
  t.equal(e.isAllowed('yellow'), false, 'yellow is not allowed')

  // allowed
  t.deepEqual(e.getValue('red'), red, 'red is correct')
  t.deepEqual(e.getValue('green'), green, 'green is correct')
  t.deepEqual(e.getValue('blue'), blue, 'blue is correct')
  t.deepEqual(e.get('red'), { name : 'red', value : red }, 'red is correct')
  t.deepEqual(e.get('green'), { name : 'green', value : green }, 'green is correct')
  t.deepEqual(e.get('blue'), { name : 'blue', value : blue }, 'blue is correct')

  // names
  t.deepEqual(e.getAllValidNames(), [ 'red', 'green', 'blue' ], 'valid names are correct')
  t.deepEqual(e.getAllValidValues(), [ red, green, blue ], 'valid valuesare correct')
  t.deepEqual(e.getAllValid(), [ { name : 'red', value : red }, { name : 'green', value : green }, { name : 'blue', value : blue } ], 'valid is correct')

  // quick tests for zero selected
  t.deepEqual(e.getAllSelectedNames(), [], 'all selected names are correct')
  t.deepEqual(e.getAllSelectedValues(), [], 'all selected values are correct')
  t.deepEqual(e.getAllSelected(), [ ], 'all selected are correct')
  t.equal(e.count(), 3, 'count is correct')
  t.equal(e.countSelected(), 0, 'count selected is correct')

  t.end()
})

test('test selected', function(t) {
  t.plan(25)

  var e = new Rok.Enum('test', 'Test')

  e.add('red', red)
  e.add('green', green)
  e.add('blue', blue)

  e.set('red')

  // isSet
  t.equal(e.isSet('red'), true, 'red is set')
  t.equal(e.isSet('green'), false, 'green is not set')
  t.equal(e.isSet('blue'), false, 'blue is not set')

  // selected
  t.equal(e.getSelectedName(), 'red', 'selected name is correct')
  t.deepEqual(e.getSelectedValue(), red, 'selected value is correct')
  t.deepEqual(e.getSelected(), { name : 'red', value : red }, 'selected is correct')

  // all selected
  t.deepEqual(e.getAllSelectedNames(), [ 'red' ], 'all selected names are correct')
  t.deepEqual(e.getAllSelectedValues(), [ red ], 'all selected values are correct')
  t.deepEqual(e.getAllSelected(), [ { name : 'red', value : red } ], 'all selected are correct')

  e.unset('red')

  // selected
  t.equal(e.getSelectedName(), null, 'selected name is correct')
  t.deepEqual(e.getSelectedValue(), null, 'selected value is correct')
  t.deepEqual(e.getSelected(), null, 'selected is correct')

  // all selected
  t.deepEqual(e.getAllSelectedNames(), [], 'all selected names are correct')
  t.deepEqual(e.getAllSelectedValues(), [], 'all selected values are correct')
  t.deepEqual(e.getAllSelected(), [], 'all selected are correct')

  e.set('green')

  // selected
  t.equal(e.getSelectedName(), 'green', 'selected name is correct')
  t.deepEqual(e.getSelectedValue(), green, 'selected value is correct')
  t.deepEqual(e.getSelected(), { name : 'green', value : green }, 'selected is correct')

  // all selected
  t.deepEqual(e.getAllSelectedNames(), [ 'green' ], 'all selected names are correct')
  t.deepEqual(e.getAllSelectedValues(), [ green ], 'all selected values are correct')
  t.deepEqual(e.getAllSelected(), [ { name : 'green', value : green } ], 'all selected are correct')

  // reset
  e.reset()

  // re-check after the reset
  t.deepEqual(e.getAllValidNames(), [ 'red', 'green', 'blue' ], 'valid names are correct')
  t.equal(e.count(), 3, 'count is correct')
  t.equal(e.countSelected(), 0, 'count selected is correct')
  t.deepEqual(e.getAllSelected(), [], 'selected is correct')

  t.end()
})

// --------------------------------------------------------------------------------------------------------------------
