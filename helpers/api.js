var request = require('request');

function resultHandler(cb) {
  return function (err, resp, body) {
    if (err) {
      cb("Request error: " + err);
    } else if (resp.statusCode != 200) {
      var msg = "Unexpected status code: " + resp.statusCode;
      if (body.error) {
        msg += ", ";
        msg += body.error;
      }
      cb(msg);
    } else {
      if (!body.success) {
        cb("Server error: " + (body.error || body.message));
      } else {
        cb(null, body);
      }
    }
  }
}

function Api(options) {
  this.options = options || {};
  this.host = this.options.host || "127.0.0.1";
  this.port = this.options.port || 7000;
  this.baseUrl = "http://" + this.host + ":" + this.port;
}

Api.prototype.get = function (path, params, cb) {
  var qs = null;
  if (typeof params === 'function') {
    cb = params;
  } else {
    qs = params;
  }
  request({
    method: "GET",
    url: this.baseUrl + path,
    json: true,
    qs: qs
  }, resultHandler(cb));
}

Api.prototype.put = function (path, data, cb) {
  request({
    method: "PUT",
    url: this.baseUrl + path,
    json: data
  }, resultHandler(cb));
}

Api.prototype.post = function (path, data, cb) {
  request({
    method: "POST",
    url: this.baseUrl + path,
    json: data
  }, resultHandler(cb));
}

Api.prototype.broadcastTransaction = function (trs, cb) {
  request({
    method: "POST",
    url: this.baseUrl + "/peer/transactions",
    // TODO magic should be read from a config file or options
    headers: {
      magic: "43194d2b"
    },
    json: {
      transaction: trs
    }
  }, resultHandler(cb));
}

module.exports = Api;