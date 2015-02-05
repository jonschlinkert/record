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
  this.path = record.path || null;
  this.encoding = record.encoding || null;

  if (typeof record.contents === 'string') {
    this.contents = new Buffer(record.contents, record.encoding);
  } else {
    this.contents = record.contents || null;
  }
}

Record.prototype.builtins = ['path', 'encoding', '_contents'];

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
    if (type.toLowerCase().search('stream') === -1) {
      type += 'Stream';
    }
  }
  return type;
};

/**
 * Clone a record
 */
Record.prototype.clone = function (opt) {
  var contents;
  if (this.isBuffer()) {
    if(opt && opt.contents) {
      contents = new Buffer(contents.length);
      this.contents.copy(contents);
    } else {
      contents = this.contents;
    }
  } else if (this.isStream()) {
    this.contents = utils.passThrough(this.contents);
    contents = utils.passThrough(this.contents);
  }

  return new Record({
    path: this.path,
    encoding: this.encoding,
    contents: contents
  });
};

/**
 * Call `toString()` on `record.contents`.
 */
Record.prototype.toString = function (enc) {
  return utils.toString(this.contents, enc);
};

/**
 * Pipe or write `record.contents` into the stream, or nothing if null.
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
