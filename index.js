'use strict';

var Stream = require('stream');
var utils = require('./lib/utils');

/**
 * Expose `Record`
 */

module.exports = Record;

/**
 * Record constructor. Create a new Record with
 * the given `record` properties.
 *
 * @param {Object} `record`
 */
function Record(record) {
  record = record || {};
  if (typeof record.contents === 'string') {
    this.contents = new Buffer(record.contents);
  } else {
    this.contents = record.contents || null;
  }
  for (var key in record) {
    if (key !== 'contents') {
      this[key] = record[key];
    }
  }
}

/**
 * Return `true` if `record.contents` is a buffer
 */
Record.prototype.isBuffer = function () {
  return utils.isBuffer(this.contents);
};

/**
 * Return `true` if `record.contents` is a stream
 */
Record.prototype.isStream = function () {
  return utils.isStream(this.contents);
};

/**
 * Return `true` if `record.contents` is null, with strict equality
 */
Record.prototype.isNull = function () {
  return utils.isNull(this.contents);
};

/**
 * Return the `type` of `record.contents`
 */
Record.prototype.type = function () {
  var type = 'Null';
  if (this.isBuffer()) {
    type = 'Buffer';
  }
  if (this.isStream()) {
    type = this.contents.constructor.name;
    if (type.toLowerCase().indexOf('stream') === -1) {
      type += 'Stream';
    }
  }
  if (this.isNull()) {
    type = 'Null';
  }
  return type;
};

/**
 * Clone a record
 */
Record.prototype.clone = function (opts) {
  if (this.isBuffer()) {
    return this.cloneBuffer(opts);
  }
  if (this.isStream()) {
    return this.cloneStream();
  }
};

/**
 * Clone `record.contents` if it's a buffer
 */
Record.prototype.cloneBuffer = function (opts) {
  var contents = opts && opts.contents
    ? utils.cloneBuffer(this.contents)
    : this.contents;
  return new Record({contents: contents});
};

/**
 * Clone `record.contents` if it's a stream
 */
Record.prototype.cloneStream = function () {
  var contents = this.contents.pipe(new Stream.PassThrough());
  this.contents = this.contents.pipe(new Stream.PassThrough());
  return new Record({contents: contents});
};

/**
 * Pipe or write `record.contents` into the stream, or nothing if null.
 */
Record.prototype.pipe = function (stream, opts) {
  opts = opts || {};
  if (typeof opts.end === 'undefined') {
    opts.end = true;
  }
  if (this.isStream()) {
    return this.contents.pipe(stream, opts);
  }
  if (this.isBuffer()) {
    if (opts.end) {
      stream.end(this.contents);
    } else {
      stream.write(this.contents);
    }
    return stream;
  }
  if (opts.end) stream.end();
  return stream;
};

/**
 * Inspect a record
 */
Record.prototype.inspect = function() {
  var result = '';
  if (this.isBuffer()) {
    result += this.contents.inspect() + ' ';
  }
  if (this.isStream()) {
    result + this.inspect(this.contents) + ' ';
  }
  return '<Record: ' + result + '>';
};

/**
 * Getter/setter for `record.contents`
 */
Object.defineProperty(Record.prototype, 'contents', {
  get: function () {
    return this._contents;
  },
  set: function (val) {
    if (!utils.isValid(val)) {
      throw new TypeError('Record expects contents to be a Buffer, Stream, or null.');
    }
    this._contents = val;
  }
});
