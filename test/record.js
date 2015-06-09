var Stream = require('stream');
var Record = require('../');
require('should');
require('mocha');

describe('Record', function () {
  describe('constructor', function () {
    it('should create a buffer if contents is a string', function (done) {
      var record = new Record({ contents: '64617461' });
      Buffer.isBuffer(record.contents).should.be.true;
      done();
    });

    it('should throw on invalid content type', function (done) {
      (function () {
        new Record({contents: []});
      }).should.throw(new Error('Contents can only be a Buffer, Stream, or null.'));
      done();
    });
  });

  describe('.isNull()', function () {
    it('should return true when the value is strictly `null`', function (done) {
      var record = new Record();
      record.isNull().should.be.true;
      record.isBuffer().should.be.false;
      record.isStream().should.be.false;
      done();
    });
  });

  describe('.isBuffer()', function (done) {
    it('should return true when the value is a Buffer', function (done) {
      var record = new Record({contents: new Buffer(0)});
      record.isBuffer().should.be.true;
      record.isNull().should.be.false;
      record.isStream().should.be.false;
      done();
    });
  });

  describe('.isStream()', function (done) {
    it('should return true when the value is a stream', function (done) {
      var record = new Record({contents: new Stream.Readable()});
      record.isStream().should.be.true;
      record.isNull().should.be.false;
      record.isBuffer().should.be.false;
      done();
    });
  });

  describe('.type()', function (done) {
    it('should detect null types', function (done) {
      new Record().type().should.equal('Null');
      done();
    });
    it('should detect buffers', function (done) {
      new Record({contents: new Buffer(0)}).type().should.equal('Buffer');
      done();
    });
    it('should detect streams', function (done) {
      new Record({contents: new Stream.Readable()}).type().should.equal('ReadableStream');
      new Record({contents: new Stream.Writable()}).type().should.equal('WritableStream');
      done();
    });
  });

  describe('.clone()', function (done) {
    it('should clone a record when contents is a buffer', function (done) {
      var a = new Record({contents: new Buffer('abc')});
      var b = a.clone();
      a.contents.should.equal(b.contents, 'can clone itself');
      a.contents.should.be.an.instanceof.Buffer;
      a.contents.toString().should.equal('abc');
      done();
    });
  });

  describe('.pipe()', function (done) {
    it('should write buffer into provided stream when contents is a buffer', function (done) {
      var buffer = new Buffer('buffer');
      var record = new Record({contents:buffer});
      var stream = new Stream.PassThrough();

      stream.on('data', function (chunk) {
        chunk.should.equal(buffer);
      });

      record.pipe(stream).should.equal(stream, 'should return the stream');
      done();
    });

    it('should connect to provided stream if contents is a stream', function (done) {
      var buffer = new Buffer('buffer');
      var record = new Record({contents:new Stream.PassThrough()});
      var stream = new Stream.PassThrough();

      stream.on('data', function (chunk) {
        chunk.should.equal(buffer);
        done();
      });

      stream.on('end', function () {
        throw new Error();
      });
      record.pipe(stream).should.equal(stream, 'should return the stream');
      record.contents.write(buffer);
    });

    it('if content is null, should do nothing', function (done) {
      var record = new Record();
      var stream = new Stream.PassThrough();
      var thrower = function () {
        throw new Error();
      };

      stream.on('data', thrower);
      stream.on('end', function () {
        done();
      });

      record.pipe(stream).should.equal(stream, 'should return the stream');
    });
  });
});
