node-thrust
===========

Official NodeJS bindings library for [Thrust](http://github.com/breach/thrust)

### Getting started

```
npm install node-thrust
```
At install, node-thrust `post_install` script automatically downloads a binary 
distribution of Thrust for the current platform.

```
require('node-thrust')(function(err, api) { 
  api.window({ root_url: 'https://breach.cc' }).show();
});
```

### Status

Supports the complete Thrust API. Works on Linux, MacOSX, Windows.

### Documentation

Pending specific node-thrust documentation, full API reference is available
in the [Thrust Documentation](https://github.com/breach/thrust/tree/master/docs)




