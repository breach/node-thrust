var async = require('async');
var common = require('../lib/common.js');
var http = require('http');

var _api = null;
var _window = null;
var _session = null;

async.series([
  function(cb_) {
    http.createServer(function(request, response) {
      var proxy = http.createClient(80, request.headers['host'])
      console.log('PROXIED REQUEST URL: ' + request.url);
      var proxy_request = proxy.request(request.method, request.url, request.headers);
      proxy_request.addListener('response', function (proxy_response) {
        proxy_response.addListener('data', function(chunk) {
          response.write(chunk, 'binary');
        });
        proxy_response.addListener('end', function() {
          response.end();
        });
        response.writeHead(proxy_response.statusCode, proxy_response.headers);
      });
      request.addListener('data', function(chunk) {
        proxy_request.write(chunk, 'binary');
      });
      request.addListener('end', function() {
        proxy_request.end();
      });
    }).listen(8080, cb_);
  },
  function(cb_) {
    require('./base.js')(function(err, api) {
      _api = api;
      return cb_(err);
    });
  },
  function(cb_) {
    _session = _api.session({
      off_the_record: true
    });
    return cb_();
  },
  function(cb_) {
    _session.proxy_set('localhost:8080', cb_);
  },
  function(cb_) {
    _window = _api.window({
      size: {
        width: 1024,
        height: 768
      },
      session: _session,
      root_url: 'http://breach.cc'
    });
    return cb_();
  },
  function(cb_) {
    _window.show(cb_);
  },
  function(cb_) {
    setTimeout(function() {
      _session.proxy_clear(cb_);
    }, 5000);
  }
], function(err) {
  if(err) {
    common.log.out('FAILED');
    common.log.error(err);
  }
  common.log.out('OK');
});
