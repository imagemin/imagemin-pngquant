'use strict';
const execa = require('execa');
const isPng = require('is-png');
const isStream = require('is-stream');
const pngquant = require('pngquant-bin');
const ow = require('ow');

const imageminPngquant = (options = {}) => input => {
	const isBuffer = Buffer.isBuffer(input);

	if (!isBuffer && !isStream(input)) {
		return Promise.reject(new TypeError(`Expected a Buffer or Stream, got ${typeof input}`));
	}

	if (isBuffer && !isPng(input)) {
		return Promise.resolve(input);
	}

	if (options.ignoreCompressed === true) {
		let bitsPerPixel = input[24] & 0xff;
		if ((input[25] & 0xff) === 2) {
			bitsPerPixel *= 3;
		} else if ((input[25] & 0xff) === 6) {
			bitsPerPixel *= 4;
		}
		if (bitsPerPixel === 8) {
			return Promise.resolve(input);
		}
	}

	const args = ['-'];

	if (typeof options.speed !== 'undefined') {
		ow(options.speed, ow.number.integer.inRange(1, 11));
		args.push('--speed', options.speed);
	}

	if (typeof options.strip !== 'undefined') {
		ow(options.strip, ow.boolean);
		args.push('--strip');
	}

	if (typeof options.quality !== 'undefined') {
		ow(options.quality, ow.array.length(2).ofType(ow.number.inRange(0, 1)));
		const [min, max] = options.quality;
		args.push('--quality', `${Math.round(min * 100)}-${Math.round(max * 100)}`);
	}

	if (typeof options.dithering !== 'undefined') {
		ow(options.dithering, ow.any(ow.number.inRange(0, 1), ow.boolean.false));

		if (typeof options.dithering === 'number') {
			args.push(`--floyd=${options.dithering}`);
		} else if (options.dithering === false) {
			args.push('--ordered');
		}
	}

	if (typeof options.posterize !== 'undefined') {
		ow(options.posterize, ow.number);
		args.push('--posterize', options.posterize);
	}

	if (typeof options.verbose !== 'undefined') {
		ow(options.verbose, ow.boolean);
		args.push('--verbose');
	}

	const subprocess = execa(pngquant, args, {
		encoding: null,
		maxBuffer: Infinity,
		input
	});

	const promise = subprocess
		.then(result => result.stdout) // eslint-disable-line promise/prefer-await-to-then
		.catch(error => {
			if (error.code === 99) {
				return input;
			}

			error.message = error.stderr || error.message;
			throw error;
		});

	subprocess.stdout.then = promise.then.bind(promise); // eslint-disable-line promise/prefer-await-to-then
	subprocess.stdout.catch = promise.catch.bind(promise);

	return subprocess.stdout;
};

module.exports = imageminPngquant;
module.exports.default = imageminPngquant;
