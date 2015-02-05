var Stream = require('stream');
var utils = require('../lib/utils');
var Record = require('..');
require('should');
require('mocha');

describe('Record utils', function () {
  describe('utils.isBuffer()', function () {
    it('should return true when the value is a Buffer', function (done) {
      utils.isBuffer(new Buffer('')).should.be.true;
      done();
    });

    it('should return false when the value is not a Buffer', function (done) {
      utils.isBuffer().should.be.false;
      utils.isBuffer({}).should.be.false;
      utils.isBuffer([]).should.be.false;
      utils.isBuffer(undefined).should.be.false;
      utils.isBuffer(456).should.be.false;
      utils.isBuffer('foo').should.be.false;
      utils.isBuffer(new Date()).should.be.false;
      utils.isBuffer(new Stream()).should.be.false;
      done();
    });
  });

  describe('utils.isNull()', function () {
    it('should return true when the value is `null`', function (done) {
      utils.isNull(null).should.be.true;
      done();
    });

    it('should return false when the value is not `null`', function (done) {
      utils.isNull().should.be.false;
      utils.isNull({}).should.be.false;
      utils.isNull([]).should.be.false;
      utils.isNull(undefined).should.be.false;
      utils.isNull(456).should.be.false;
      utils.isNull('foo').should.be.false;
      utils.isNull(new Date()).should.be.false;
      utils.isNull(new Buffer('')).should.be.false;
      done();
    });
  });


  describe('utils.isStream()', function () {
    it('should return true when the value is a Stream', function (done) {
      utils.isStream(new Stream()).should.be.true;
      done();
    });

    it('should return false when the value is not a Stream', function (done) {
      utils.isStream().should.be.false;
      utils.isStream({}).should.be.false;
      utils.isStream([]).should.be.false;
      utils.isStream(undefined).should.be.false;
      utils.isStream(456).should.be.false;
      utils.isStream('foo').should.be.false;
      utils.isStream(new Date()).should.be.false;
      utils.isStream(new Buffer('')).should.be.false;
      done();
    });
  });
});