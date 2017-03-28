'use strict';

var processFn = function (fn, P, context, opts) {
	return function () {
		var args = new Array(arguments.length);

		for (var i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		return new P(function (resolve, reject) {
			args.push(function (err, result) {
				if (err) {
					reject(err);
				} else {

					if (opts.multiArgs) {

						var results = new Array(arguments.length - 1);

						for (var i = 1; i < arguments.length; i++) {
							results[i - 1] = arguments[i];
						}

						resolve(results);

					} else {
						resolve(result);
					}
				}
			});

			fn.apply(context, args);
		});
	}
};

module.exports = function (obj, P, opts) {
	var proto = Object.getPrototypeOf(obj)

	if (!proto) {
		throw new Error('object has no prototype')
	}

	if (typeof P !== 'function') {
		opts = P;
		P = Promise;
	}

	opts = opts || {};

	var exclude = opts.exclude || [/.+Sync$/];

	var filter = function (key) {
		var match = function (pattern) {
			return typeof pattern === 'string' ? key === pattern : pattern.test(key);
		};

		return opts.include ? opts.include.some(match) : !exclude.some(match);
	};

	var newProto = Object.keys(proto).reduce(function (newProto, key) {
		var x = obj[key];

		if (typeof x === 'function' && filter(key)) {
			newProto[key] = processFn(x, P, obj, opts)
		} else if (typeof x === 'function') {
			newProto[key] = x.bind(obj)
		} else {
			newProto[key] = x
		}

		return newProto;
	}, {});

	var props = Object.keys(obj).reduce(function (props, key) {
		props[key] = Object.getOwnPropertyDescriptor(obj, key)
		return props
	}, {})

	return Object.create(newProto, props)
};
