// --------------------------------------------------------------------------------------------------------------------

"use strict"

// npm
var test = require('tape')

// local
var Rok = require('../')

// --------------------------------------------------------------------------------------------------------------------

test('create a List', function(t) {
  t.plan(10)

  var e1 = new Rok.List()

  t.equal(e1.type(), 'List', '.type() is correct')
  t.equal(e1.getName(), '', 'name is correct')
  t.equal(e1.getTitle(), '', 'title is correct')
  t.deepEqual(e1.getOpts(), {}, 'opts is correct')
  t.deepEqual(e1.getMeta(), {}, 'meta is correct')

  var e2 = new Rok.List('test', 'Test', { thing : true }, { title : 'Hello' })

  t.equal(e2.type(), 'List', '.type() is correct')
  t.equal(e2.getName(), 'test', 'name is correct')
  t.equal(e2.getTitle(), 'Test', 'title is correct')
  t.deepEqual(e2.getOpts(), { thing : true }, 'opts is correct')
  t.deepEqual(e2.getMeta(), { title : 'Hello' }, 'meta is correct')

  t.end()
})

test('add some items, take some away', function(t) {
  t.plan(14)

  var e = new Rok.List('list', 'A List')

  t.equal(e.count(), 0, "nothing in the list")

  // push (push onto the top)
  t.equal(e.push({ t : "Hi" }), 1, "added one item")
  t.equal(e.push({ t : "Hello" }), 2, "second item added")
  t.equal(e.push({ t : "Ola" }), 3, "third item added")

  t.equal(e.count(), 3, "three items in the list")
  t.deepEqual(e.getList(), [{t:"Hi"}, {t:"Hello"}, {t:"Ola"}], "three items in the list")

  // pop (pop off the top)
  t.deepEqual(e.pop(), {t:"Ola"}, "pop the last item is correct")
  t.equal(e.count(), 2, "two left")
  t.deepEqual(e.getList(), [{t:"Hi"}, {t:"Hello"}], "three items in the list")

  // shift (shift from the start)
  t.deepEqual(e.shift(), {t:"Hi"}, "shift the first item is correct")
  t.deepEqual(e.getList(), [{t:"Hello"}], "one item in the list")

  // unshift (onto the start)
  t.equal(e.unshift({ t : "Hi" }), 2, "unshift removes another item")
  t.equal(e.count(), 2, "two again")
  t.deepEqual(e.getList(), [{t:"Hi"}, {t:"Hello"}], "the list is correct again")

  t.end()
})

test('some queries and change some items', function(t) {
  t.plan(10)

  var e = new Rok.List('list', 'A List')

  var all = [
    { t : "Hi", p : 0 },
    { t : "Hello" },
    { t : "Ola", p : 1 },
    { t : "Hello" },
  ]

  all.forEach(function(item) {
    e.push(item)
  })

  t.deepEqual(e.filter("t", "Hi"), [ all[0] ], "filter Hi is okay")
  t.deepEqual(e.filter("t", "Hello"), [ all[1], all[3] ], "filter Hello is okay")
  t.deepEqual(e.filter("t", "Ola"), [ all[2] ], "filter Ola is okay")

  var hi = {t:"Hi"}
  e.setItem(2, hi)
  t.deepEqual(e.filter("t", "Hi"), [ {p:0,t:"Hi"}, hi ], "filter Hi now has two items")
  t.deepEqual(e.filter("t", "Ola"), [], "filter Ola is now empty")

  var hello = {t:"Hello"}
  e.setItemKey(2, "t", "Hello")
  t.deepEqual(e.filter("t", "Hi"), [ {p:0,t:"Hi"} ], "filter Hi now has one item")
  t.deepEqual(e.filter("t", "Hello"), [ hello, hello, hello ], "filter Hello is okay")

  e.setItem(2, {p:1,t:"Ola"})
  t.deepEqual(e.getList(), all, "list back to it's original")

  // filterHasKey
  t.deepEqual(e.filterHasKey("p"), [all[0], all[2]], "filterHasKey for p is okay")
  t.deepEqual(e.filterHasKey("t", "Hello"), all, "filterHasKey for t is okay")

  t.end()
})

test('some sort stuff', function(t) {
  t.plan(4)

  var e = new Rok.List('list', 'A List')

  e.push({ p : 3, t : "Hi" })
  e.push({ p : 0, t : "Hello" })
  e.push({ p : 2, t : "Ola" })
  e.push({ p : 1, t : "Yo" })

  t.deepEqual(e.sort("p"), [{p:0,t:"Hello"},{p:1,t:"Yo"},{p:2,t:"Ola"},{p:3,t:"Hi"}], "sort on 'p' worked")
  t.deepEqual(e.sort("t"), [{p:0,t:"Hello"},{p:3,t:"Hi"},{p:2,t:"Ola"},{p:1,t:"Yo"}], "sort on 't' worked")

  t.deepEqual(e.sort("p"), [{p:0,t:"Hello"},{p:1,t:"Yo"},{p:2,t:"Ola"},{p:3,t:"Hi"}], "sort on 'p' worked")
  t.deepEqual(e.sort("t"), [{p:0,t:"Hello"},{p:3,t:"Hi"},{p:2,t:"Ola"},{p:1,t:"Yo"}], "sort on 't' worked")

  t.end()
})

test('find and findIndex', function(t) {
  t.plan(17)

  var e = new Rok.List('list', 'A List')

  e.push({ p : 3, t : "Hi" })
  e.push({ p : 0, t : "Hello" })
  e.push({ p : 2, t : "Ola" })
  e.push({ p : 1, t : "Yo" })

  t.equal(e.findIndex("p", 0), 1, "findIndex p=0 worked")
  t.equal(e.findIndex("p", 1), 3, "findIndex p=1 worked")
  t.equal(e.findIndex("p", 2), 2, "findIndex p=2 worked")
  t.equal(e.findIndex("p", 3), 0, "findIndex p=3 worked")
  t.equal(e.findIndex("p", 5), -1, "findIndex p=5 didn't return anything as expected")

  t.deepEqual(e.find("p", 0), {"p":0,t:"Hello"}, "find p=0 worked")
  t.deepEqual(e.find("p", 1), {"p":1,t:"Yo"}, "find p=1 worked")
  t.deepEqual(e.find("p", 2), {"p":2,t:"Ola"}, "find p=2 worked")
  t.deepEqual(e.find("p", 3), {"p":3,t:"Hi"}, "find p=3 worked")
  t.ok(!e.find("p", 5), "find p=5 didn't return anything as expected")

  t.equal(e.findIndex("t", "Hi"), 0, "find t=Hi worked")
  t.equal(e.findIndex("t", "Hello"), 1, "find t=Hello worked")
  t.equal(e.findIndex("t", "Ola"), 2, "find t=Ola worked")
  t.equal(e.findIndex("t", "Yo"), 3, "find t=Yo worked")
  t.equal(e.findIndex("t", "Blah"), -1, "find t=Blah didn't work as expected")

  t.equal(e.findIndex("x", "whatever"), -1, "findIndex x didn't work (as expected)")
  t.equal(e.find("x", "whatever"), undefined, "find x didn't work (as expected)")

  t.end()
})

test('set some fields and reset', function(t) {
  t.plan(5)

  var all = [
    { name : "Anne" },
    { name : "Bob"  },
    { name : "Cara" },
    { name : "Dave" },
  ]

  var e = new Rok.List('list', 'A List')
  all.forEach(function(item) {
    e.push(item)
  })

  t.deepEqual(e.getList(), all, "list is as expected")
  t.equal(e.count(), 4, "got 4 items")

  // make some changes
  e.setItem(0, { name : "Andy" })
  e.setItemKey(1, "age", 28)
  e.setItemKey(3, "email", "dave@example.com")

  var updated = [
    { name : "Andy" },
    { name : "Bob", age : 28 },
    { name : "Cara" },
    { name : "Dave", email : "dave@example.com" },
  ]

  t.deepEqual(e.getList(), updated, "updated list is as expected")

  // reset
  e.reset()
  t.deepEqual(e.getList(), all, "reset worked, list same as the original")
  t.equal(e.count(), 4, "got 4 items still")

  t.end()
})

// --------------------------------------------------------------------------------------------------------------------
