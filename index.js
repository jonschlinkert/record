var utils = require('./lib/utils');

/**
 * Expose `Record`
 */

module.exports = Record;

/**
 * Record constructor. Create a new Record with
 * the given `file` properties.
 *
 * @param {Object} `file`
 */
function Record(file) {
  file = file || {};
  this.path = file.path || null;
  this.encoding = file.encoding || null;

  if (typeof file.contents === 'string') {
    this.contents = new Buffer(file.contents, file.encoding);
  } else {
    this.contents = file.contents || null;
  }
}

/**
 * Return `true` if `file.contents` is a buffer
 */
Record.prototype.isBuffer = function () {
  return utils.isBuffer(this.contents);
};

/**
 * Return `true` if `file.contents` is a stream
 */
Record.prototype.isStream = function () {
  return utils.isStream(this.contents);
};

/**
 * Return `true` if `file.contents` is null, with strict equality
 */
Record.prototype.isNull = function () {
  return utils.isNull(this.contents);
};

/**
 * Return the `type` of `file.contents`
 */
Record.prototype.type = function () {
  var type = 'Null';
  if (this.isBuffer()) {
    type = 'Buffer';
  }
  if (this.isStream()) {
    type = this.contents.constructor.name;
    if (type.toLowerCase().search('stream') === -1) {
      type += 'Stream';
    }
  }
  return type;
};

/**
 * Clone a record
 */
Record.prototype.clone = function () {
  var contents = this.contents;
  if (this.isBuffer()) {
    contents = new Buffer(contents.length);
    this.contents.copy(contents);
  }
  return new this.constructor({
    path: this.path,
    encoding: this.encoding,
    contents: contents
  });
};

/**
 * Call `toString()` on `file.contents`.
 */
Record.prototype.toString = function (enc) {
  enc = enc || this.encoding;
  if (!this.isBuffer()) {
    throw new Error('Record#toString() is only valid when `contents` is a Buffer.');
  }
  return this.contents.toString(enc);
};

/**
 * Pipe or write `file.contents` into the stream, or nothing if null.
 */
Record.prototype.pipe = function (stream, opt) {
  opt = opt || {};
  if (typeof opt.end === 'undefined') { opt.end = true; }
  if (this.isStream()) { return this.contents.pipe(stream, opt); }
  if (this.isBuffer()) {
    if (opt.end) {
      stream.end(this.contents);
    } else {
      stream.write(this.contents);
    }
    return stream;
  }
  if (this.isNull()) {
    if (opt.end) { stream.end(); }
    return stream;
  }
};

Record.prototype.inspect = function () {
  return '<Record::' + this.type() + (this.path ? ' path="' + this.path + '"' : '') + '>';
};

Object.defineProperty(Record.prototype, 'contents', {
  get: function () {
    return this._contents;
  },
  set: function (val) {
    if (!utils.isValid(val)) {
      throw new Error('Contents can only be a Buffer, a Stream, or null.');
    }
    this._contents = val;
  }
});
