# express-brute-loki

[![NPM version](http://img.shields.io/npm/v/express-brute-loki.svg)](https://www.npmjs.com/package/express-brute-loki)
[![Build Status](https://travis-ci.org/Requarks/connect-loki.svg?branch=master)](https://travis-ci.org/Requarks/express-brute-loki)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0dfbd8126e5a4db6ab044df67957e4c5)](https://www.codacy.com/app/Requarks/express-brute-loki)
[![Dependency Status](https://gemnasium.com/badges/github.com/Requarks/express-brute-loki.svg)](https://gemnasium.com/github.com/Requarks/express-brute-loki)
[![Known Vulnerabilities](https://snyk.io/test/github/requarks/express-brute-loki/badge.svg)](https://snyk.io/test/github/requarks/express-brute-loki)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/requarks/express-brute-loki/blob/master/LICENSE)

##### A Loki.js store for Express-Brute

### Installation

```shell
npm install express-brute-loki
```

### Usage

```js
var ExpressBrute = require('express-brute'),
    ExpressBruteLokiStore = require('express-brute-loki');

var store = new ExpressBruteLokiStore({
    path: './brute.db' // See all available options below
});
var bruteforce = new ExpressBrute(store);

app.post('/auth',
    bruteforce.prevent, // error 403 if we hit this route too often
    function (req, res, next) {
        res.send('Success!');
    }
);
```

### Options

Setting the `path` to the database file is optional but recommended.

Available parameters:

-	`path` Path to the database file. Defaults to `./brute-store.db`
-	`autosave` Set `false` to disable save to disk. Defaults to `true`
- `ttl` Duration in seconds to keep entries. Set to `0` to disable TTL. Defaults to `0`
-	`logErrors` Whether or not to log client errors. Defaults to `false`
	-	If `true`, a default logging function (`console.error`) is provided.
	-	If a function, it is called anytime an error occurs (useful for custom logging)
	-	If `false`, no logging occurs.

### License

MIT