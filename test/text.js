// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var test = require('tape')

// local
var Rok = require('../')

// --------------------------------------------------------------------------------------------------------------------

test('create a Text', function(t) {
  t.plan(12)

  var e1 = new Rok.Text('status', 'Status')
  t.equal(e1.type(), 'Text', '.type() is correct')
  t.equal(e1.getName(), 'status', 'name is correct')
  t.equal(e1.getTitle(), 'Status', 'title is correct')
  t.deepEqual(e1.getOpts(), {}, 'opts is correct')
  t.deepEqual(e1.getMeta(), {}, 'meta is correct')
  t.equal(e1.getText(), '', 'text is correct')

  var e2 = new Rok.Text()
  t.equal(e2.type(), 'Text', '.type() is correct')
  t.equal(e2.getName(), '', 'name is correct')
  t.equal(e2.getTitle(), '', 'title is correct')
  t.deepEqual(e2.getOpts(), {}, 'opts is correct')
  t.deepEqual(e2.getMeta(), {}, 'meta is correct')
  t.equal(e2.getText(), '', 'text is correct')

  t.end()
})

test('set and set the text', function(t) {
  t.plan(6)

  var e1 = new Rok.Text()
  e1.setText('')
  t.equal(e1.getText(), '', 'text is correct')
  e1.setText('hi')
  t.equal(e1.getText(), 'hi', 'text is correct')
  e1.reset()
  t.equal(e1.getText(), '', 'text is correct')

  var e2 = new Rok.Text('hello', 'Hello', null, { field : 'blah' })

  e2.setText('')
  t.equal(e2.getText(), '', 'text is correct')
  e2.setText('hi')
  t.equal(e2.getText(), 'hi', 'text is correct')
  e2.reset()
  t.equal(e2.getText(), '', 'text is correct')

  t.end()
})

// --------------------------------------------------------------------------------------------------------------------
