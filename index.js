'use strict';
var spawn = require('child_process').spawn;
var isPng = require('is-png');
var pngquant = require('pngquant-bin');
var through = require('through2');

module.exports = function (opts) {
	opts = opts || {};

	return through.ctor({objectMode: true}, function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new Error('Streaming is not supported'));
			return;
		}

		if (!isPng(file.contents)) {
			cb(null, file);
			return;
		}

		var args = ['-'];
		var ret = [];
		var err = '';
		var len = 0;

		if (opts.floyd && typeof opts.floyd === 'number') {
			args.push('--floyd=' + opts.floyd);
		}

		if (opts.floyd && typeof opts.floyd === 'boolean') {
			args.push('--floyd');
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

		cp.stderr.setEncoding('utf8');
		cp.stderr.on('data', function (data) {
			err += data;
		});

		cp.stdout.on('data', function (data) {
			ret.push(data);
			len += data.length;
		});

		cp.on('error', function (err) {
			err.fileName = file.path;
			cb(err);
			return;
		});

		cp.on('close', function (code) {
			if (code && code !== 99) {
				err = new Error(err);
				err.fileName = file.path;
				cb(err);
				return;
			}

			if (len < file.contents.length) {
				file.contents = Buffer.concat(ret, len);
			}

			cb(null, file);
		});

		cp.stdin.end(file.contents);
	});
};
