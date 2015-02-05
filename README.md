# record [![NPM version](https://badge.fury.io/js/record.svg)](http://badge.fury.io/js/record)

> The canonical implementation of node-task's [Record specification](https://github.com/node-task/spec/wiki/Record)

## Usage

```js
var File = require('record');

var file = new File({
  path: 'path/to/file',
  encoding: 'utf8',
  contents: 'i will be turned into a buffer'
});
```

### File

#### file.path

Path to file.

Type: `String`
Default: `null`

#### file.contents

File contents.

Type: `Buffer, Stream, or null`
Default: `null`

#### file.encoding

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

_For usage with Buffer-backed records only._  Calls `toString()` on the underlying buffer.

- If no encoding is provided, the Record's optional encoding property will be used.
- If neither is available, will default to `utf8` encoding.

### pipe(stream[, opt])

- If the record contents are a Buffer, it will be written to the provided stream.
- If the record contents are a Stream, pipe them to the provided stream.
- If the record contents are null, this will do nothing.
- If `opt.end` is true, [the destination stream will not be ended](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options).

Returns the provided stream.
