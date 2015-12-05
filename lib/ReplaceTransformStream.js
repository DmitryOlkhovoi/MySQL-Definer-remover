"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _stream = require("stream");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ReplaseStream(regex, options) {
  if (!regex) throw "Regex must to be set";

  if (!(this instanceof ReplaseStream)) {
    return new ReplaseStream(regex, options);
  }

  _stream.Transform.call(this, options);
  this.regex = regex;
}

_util2.default.inherits(ReplaseStream, _stream.Transform);

ReplaseStream.prototype._transform = function (line, encoding, done) {
  if (this.regex.test(line)) {
    this.push(line.replace(this.regex, '') + "\r\n");
  }

  done();
};

exports.default = ReplaseStream;