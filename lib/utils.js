var Stream = require('stream');

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