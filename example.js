var Record = require('./');

var record = new Record({
  path: 'a/b/c/foo.md',
  contents: 'This is contents'
});


console.log(record.contents.toString());
