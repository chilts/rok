// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var test = require('tape')

// --------------------------------------------------------------------------------------------------------------------

test('require rok', function(t) {
  t.plan(1)

  t.ok(require('../'), 'rok required ok')

  t.end()
})

// --------------------------------------------------------------------------------------------------------------------
