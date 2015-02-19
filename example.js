var Record = require('./');

var file = new Record({
  path: 'a/b/c/foo.md',
  contents: 'This is contents'
});


console.log(file.builtins)