var marvelStream = require('./')
var test = require('tape')
var conf = require('./.apikey.json')

test('streams Marvel API data', function (t) {
  t.plan(10)
  var characters = []
  var stream = marvelStream('characters', {
    publicKey: conf.publicKey,
    privateKey: conf.privateKey,
    pages: 2,
    query: {
      limit: 5,
    }
  })
  
  stream.on('info', function (ev) {
    console.log('%s\n', ev.attributionText)
    t.equal(typeof ev.copyright, 'string', 'has copyright')
  })
  
  stream.once('page', function (ev) {
    t.equal(characters.length, 0, 'no characters pushed yet')
    t.ok(ev.total > 100, 'has some length')
    t.equal(ev.count, 5, 'got 5 for a page')
    t.equal(ev.limit, 5, 'got 5 limit')
    t.equal(ev.offset, 0, 'got 5 limit')
    t.equal(ev.page, 0, 'first page')
    
    stream.once('page', function (ev) {
      t.equal(ev.page, 1, 'next page')
    })
  })
  
  stream.on('error', function (err) {
    t.fail(err.message)
  })
  
  stream.on('data', function (character) {
    characters.push(character)
  })
  
  stream.on('end', function () {
    t.equal(characters.length, 10, 'streamed in 2 pages')
    t.equal(typeof characters[0].name, 'string', 'got character data')
  })
})
