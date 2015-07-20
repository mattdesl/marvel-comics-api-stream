# marvel-comics-api-stream

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Streams paginated [Marvel Comics API](http://developer.marvel.com/documentation/getting_started) data. By default, streams until no more pages remain, but can be configured to stream a limited number of pages.

For a lower level interface, see [marvel-comics-api](https://github.com/mattdesl/marvel-comics-api).

## Install

```sh
npm install marvel-comics-api-stream --save
```

## Example

```js
var marvel = require('marvel-comics-api-stream')

// stream in 3 pages of data
marvel('comics', {
  publicKey: conf.publicKey,
  privateKey: conf.privateKey,
  pages: 3
}).on('info', function (ev) {
  console.log('%s\n', ev.attributionText)
}).on('data', function (comic) {
  console.log(comic.title)
}).on('end', function () {
  console.log('Finished!')
})
```

Result:

```
Data provided by Marvel. © 2015 MARVEL

Ant-Man: So (Trade Paperback)
Uncanny X-Men (2013) #600
Brilliant (2011) #6
Secret Wars (2015) #6
Future Imperfect (2015) #5
Agent Carter: S.H.I.E.L.D. 50th Anniversary (2015) #1
Daredevil (2014) #18
E Is for Extinction (2015) #4
Figment 2 (2015) #1
...
...
...
Finished!
```

## Usage

[![NPM](https://nodei.co/npm/marvel-comics-api-stream.png)](https://www.npmjs.com/package/marvel-comics-api-stream)

#### `stream = marvelStream(api, opt)`

Streams Marvel data from the given `api` entry point (like `'characters'` or `'comics'`). The stream emits `'data'` events for each element in the response's `data.results` array.

Options:

- `publicKey` (string)
  - **required** - your public API key
- `privateKey` (string)
  - **required** - your private API key
- `pages` (Number|any)
  - if specified and a number, no more than that many pages of content will be streamed
  - otherwise, if a non-number is passed, assumes all content is desired, and streams until no pages are left
  
The other options are passed to [marvel-comics-api](https://github.com/mattdesl/marvel-comics-api), like `query` and `timeout`. 

Once all data has been streamed, or once we've hit our desired number of pages, emits an `end` event.

### events

#### `stream.on('info', fn)`

Triggered once before any other events, providing the following:

```js
{
  copyright: String,       // copyright detail
  attributionText: String, // attribution detail
  attributionHTML: String, // attribution detail
}
```

#### `stream.on('page', fn)`

Emits `'page'` for each request.

```js
{
  page: Number,   // current page index
  offset: Number, // current offset index into the results
  limit: Number,  // the resulting limit for this page
  count: Number,  // the number of results in this page
  total: Number   // total number of results across all pages
}
```

#### `stream.on('data', fn)`

After `'page'` is emitted, that page will emit a `'data'` event for each of its entity results (e.g. a comic book or character). See [Entity Types](http://developer.marvel.com/documentation/entity_types) for details on their structure.

## running tests

To run tests, you will need a Marvel Developer account. Once you have API keys, copy them into a file in `.apikey.json` that looks like this:

```json
{
  "privateKey": "egadg545151232d02ea0b9asdfasdfd5699a",
  "publicKey": "badsg1cbadsggagafdh0"
}
```

## See Also

- [marvel-comics-api](https://github.com/mattdesl/marvel-comics-api)

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/marvel-comics-api-stream/blob/master/LICENSE.md) for details.
