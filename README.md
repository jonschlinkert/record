# record [![NPM version](https://badge.fury.io/js/record.svg)](http://badge.fury.io/js/record)

> The canonical implementation of node-task's [Record specification](https://github.com/node-task/spec/wiki/Record)

## Usage

```js
var Record = require('record');

var record = new Record({
  contents: 'i will be turned into a buffer'
});
```

### Record

#### record.path

Path to record.

Type: `String`
Default: `null`

#### record.contents

Record contents.

Type: `Buffer, Stream, or null`
Default: `null`

#### record.encoding

Default encoding to be used with `toString()`.


## API

### type()

Return the type of Record. (Null, Buffer, ReadableStream, etc).

### isNull()

Return true if the record contents are null.

### isBuffer()

Return true if the record contents are a Buffer.

### isStream()

Return true if the record contents are a Stream.

### clone()

Return a clone of the record.

### toString()

Calls `toString()` on `record.contents`.

- _`record.contents` must already be a buffer, or an error is thrown._
- If no encoding is provided, the Record's optional encoding property will be used.
- If neither is available, will default to `utf8` encoding.

### pipe(stream[, opt])

- If the record contents are a Buffer, it will be written to the provided stream.
- If the record contents are a Stream, pipe them to the provided stream.
- If the record contents are null, this will do nothing.
- If `opt.end` is true, [the destination stream will not be ended](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options).

Returns the provided stream.
