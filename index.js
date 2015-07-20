var marvelApi = require('marvel-comics-api')
var through = require('through2').obj

module.exports = marvelApiStream
function marvelApiStream (api, opt) {
  opt = opt || {}
  var pages = opt.pages
  var stream = through()

  if (pages === 0) { // no pages, no data
    stream.push(null)
    return stream
  }

  var query = opt.query || {}
  var numPages = 0
  var hasInfo = false
  
  next()
  return stream

  function next () {
    marvelApi(api, opt, function (err, body) {
      if (err) {
        return stream.emit('error', err)
      }
      if (!(/^2/.test(body.code))) {
        return stream.emit('error', new Error(
          'Error Code: ' + body.code + ', status: ' + body.status
        ))
      }

      var data = body.data
      
      // so user can access attribution & total easily
      if (!hasInfo) {
        hasInfo = true

        // provide attribution & total
        stream.emit('info', {
          copyright: body.copyright,
          attributionText: body.attributionText,
          attributionHTML: body.attributionHTML
        })
      }

      // so user can access page offset etc
      stream.emit('page', {
        offset: data.offset,
        limit: data.limit,
        count: data.count,
        total: data.total,
        page: numPages
      })

      if (data.results && data.results.length) {
        data.results.forEach(function (item) {
          stream.emit('data', item)
        })
      }

      // find next page of data
      var offset = data.offset
      var count = data.count
      numPages++

      if (offset + count < data.total &&
          (typeof pages !== 'number' || numPages < pages)) {
        query.offset = offset + count
        next()
      } else {
        // no more data
        stream.push(null)
      }
    })
  }
}
