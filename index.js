import {execa} from 'execa';
import isPng from 'is-png';
import pngquant from 'pngquant-bin';
import ow from 'ow';
import {isUint8Array} from 'uint8array-extras';
import {isBrowser} from 'environment';

export default function imageminPngquant(options = {}) {
	if (isBrowser) {
		throw new Error('This package does not work in the browser.');
	}

	return async input => {
		const isData = isUint8Array(input);

		if (!isUint8Array(input)) {
			throw new TypeError(`Expected a Uint8Array, got ${typeof input}`);
		}

		if (isData && !isPng(input)) {
			return input;
		}

		const arguments_ = ['-'];

		if (options.speed !== undefined) {
			ow(options.speed, ow.number.integer.inRange(1, 11));
			arguments_.push('--speed', options.speed.toString());
		}

		if (options.strip !== undefined) {
			ow(options.strip, ow.boolean);

			if (options.strip) {
				arguments_.push('--strip');
			}
		}

		if (options.quality !== undefined) {
			ow(options.quality, ow.array.length(2).ofType(ow.number.inRange(0, 1)));
			const [min, max] = options.quality;
			arguments_.push('--quality', `${Math.round(min * 100)}-${Math.round(max * 100)}`);
		}

		if (options.dithering !== undefined) {
			ow(options.dithering, ow.any(ow.number.inRange(0, 1), ow.boolean.false));

			if (typeof options.dithering === 'number') {
				arguments_.push(`--floyd=${options.dithering}`);
			} else if (options.dithering === false) {
				arguments_.push('--ordered');
			}
		}

		if (options.posterize !== undefined) {
			ow(options.posterize, ow.number);
			arguments_.push('--posterize', options.posterize.toString());
		}

		try {
			const {stdout} = await execa(pngquant, arguments_, {
				encoding: 'buffer',
				maxBuffer: Number.POSITIVE_INFINITY,
				input,
			});

			return stdout;
		} catch (error) {
			// Handling special condition from pngquant binary (status code 99).
			if (error.exitCode === 99) {
				return input;
			}

			throw error;
		}
	};
}
