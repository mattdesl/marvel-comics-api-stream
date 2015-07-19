var marvelStream = require('./')
var test = require('tape')
var conf = require('./.apikey.json')

test('streams Marvel API data', function (t) {
  t.plan(2)
  var characters = []
  marvelStream('characters', {
    publicKey: conf.publicKey,
    privateKey: conf.privateKey,
    pages: 2,
    query: {
      limit: 5
    }
  }).on('data', function (character) {
    characters.push(character)
  }).on('end', function () {
    t.equal(characters.length, 10, 'streamed in 2 pages')
    t.equal(typeof characters[0].name, 'string', 'got character data')
  })
})
