var Stream = require('stream');

exports.toString = function toString(val, opts) {
  enc = enc || this.encoding;
  if (!exports.isBuffer(val)) {
    throw new Error('toString() may only be used when `contents` is a Buffer.');
  }
  return val.toString(enc);
};

exports.isBuffer = function isBuffer(o) {
  return Buffer.isBuffer(o);
};

exports.isStream = function isStream(o) {
  return !!o && o instanceof Stream;
};

exports.isNull = function isNull(o) {
  return o === null;
};

exports.isValid = function isValid(o) {
  return exports.isBuffer(o)
    || exports.isStream(o)
    || exports.isNull(o);
};

exports.passThrough = function passThrough(val) {
  return val.pipe(new Stream.PassThrough())
};