'use strict';

var isPng = require('is-png');
var pngquant = require('pngquant-bin').path;
var spawn = require('child_process').spawn;

/**
 * pngquant imagemin plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};

	return function (file, imagemin, cb) {
		if (!isPng(file.contents)) {
			cb();
			return;
		}

		var args = ['--skip-if-larger', '-'];
		var ret = [];
		var len = 0;

		if (opts.floyd) {
			args.push('--floyd', opts.floyd);
		}

		if (opts.nofs) {
			args.push('--nofs');
		}

		if (opts.posterize) {
			args.push('--posterize', opts.posterize);
		}

		if (opts.quality) {
			args.push('--quality', opts.quality);
		}

		if (opts.speed) {
			args.push('--speed', opts.speed);
		}

		if (opts.verbose) {
			args.push('--verbose');
		}

		var cp = spawn(pngquant, args);

		cp.on('error', function (err) {
			cb(err);
			return;
		});

		cp.stderr.setEncoding('utf8');
		cp.stderr.on('data', function (data) {
			cb(data);
			return;
		});

		cp.stdout.on('data', function (data) {
			ret.push(data);
			len += data.length;
		});

		cp.on('close', function () {
			file.contents = Buffer.concat(ret, len);
			cb();
		});

		cp.stdin.end(file.contents);
	};
};
