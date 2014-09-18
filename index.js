'use strict';

var ExecBuffer = require('exec-buffer');
var isPng = require('is-png');
var pngquant = require('pngquant-bin').path;

/**
 * pngquant image-min plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};
	
	var errorCodes = {
		SUCCESS : 0,
		MISSING_ARGUMENT : 1,
		READ_ERROR : 2,
		INVALID_ARGUMENT : 4,
		NOT_OVERWRITING_ERROR : 15,
		CANT_WRITE_ERROR : 16,
		OUT_OF_MEMORY_ERROR : 17,
		WRONG_ARCHITECTURE : 18, // Missing SSE
		PNG_OUT_OF_MEMORY_ERROR : 24,
		LIBPNG_FATAL_ERROR : 25,
		LIBPNG_INIT_ERROR : 35,
		TOO_LARGE_FILE : 98,
		TOO_LOW_QUALITY : 99
	};

	return function (file, imagemin, cb) {
		if (!isPng(file.contents)) {
			cb();
			return;
		}

		var args = ['--skip-if-larger'];
		var exec = new ExecBuffer();

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

		exec
			.use(pngquant, args.concat(['-f', '-o', exec.dest(), exec.src()]))
			.run(file.contents, function (err, buf) {
				if (err) {
					cb(errorCodes.TOO_LARGE_FILE ? null : err);
					return;
				}

				file.contents = buf;
				cb();
			});
	};
};
