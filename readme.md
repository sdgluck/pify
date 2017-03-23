# pify-proto

> Promisify methods on the prototype of an object

<a href="http://badge.fury.io/js/pify-proto"><img alt="npm version" src="https://badge.fury.io/js/pify-proto.svg"></a>

- Exclusively for promisfying enumerable methods on a prototype
- Does not modify the original object prototype; returns a copy with a new prototype*
- Only `include`/`exclude` options (I don't need the others; always open to PRs)

_* In order that the lib can operate normally if it uses any method internally
(because it will be passing callbacks as per original method signature)._

---

Credit goes to [Sindre Sorhus](http://sindresorhus.com)
and other contributors of [`pify`](https://github.com/sindresorhus/pify),
for which this is a fork. Thanks y'all!

## Install

```
$ npm install --save pify-proto
```

## Usage

```js
const pify = require('pify-proto');

class SomeConstructor {
  constructor () {
    this.foo = 'bar'
  }
  
  baz (cb) {
    cb(null, this.foo)
  }
}

// promisify prototype of an object

const inst = pify(new SomeConstructor())

inst.baz().then(console.log.bind(console))
//=> 'foo'
```

## API

### pify(input, [promiseModule], [options])

Returns a new object with prototype methods on `obj` promisified.

#### input

Type: `object`

The object to promisify.

#### promiseModule

Type: `function`

Custom promise module to use instead of the native one.

Check out [`pinkie-promise`](https://github.com/floatdrop/pinkie-promise) if you need a tiny promise polyfill.

#### options

##### include

Type: `array` of (`string`|`regex`)

Methods in a module to promisify. Remaining methods will be left untouched.

##### exclude

Type: `array` of (`string`|`regex`)<br>
Default: `[/.+Sync$/]`

Methods in a module **not** to promisify. Methods with names ending with `'Sync'` are excluded by default.

##### multiArgs

Type: `boolean`<br>
Default: `false`

By default, the promisified methods will only return the second argument from the callback, which works fine for most APIs. This option can be useful for modules like `oauth` with prototype methods that return multiple arguments. Turning this on will make it return an array of all arguments from the callback, excluding the error argument, instead of just the second argument.

```js
const OAuth = require('oauth').OAuth;
const pify = require('pify-proto');

const oauth = pify(new OAuth(
    'http://blah',
    'http://blah',
    'blah blah'
), {multiArgs: true});

oauth.getOAuthRequestToken()
.then(result => {
	const [ oauth_token, oauth_secret ] = result;
});
```

## Authors & License

`pify` was created by [Sindre Sorhus](http://sindresorhus.com).

`pify-proto` was created by [Sam Gluck](https://twitter.com/sdgluck).

`pify-proto` contributors:

* [Scott Donnelly (@sdd)](https://github.com/sdd)

`pify-proto` is released under the MIT license.
