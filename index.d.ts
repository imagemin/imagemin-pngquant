type Options = {
	/**
	 * Speed `10` has 5% lower quality, but is about 8 times faster than the default. Speed `11` disables dithering and lowers compression level.
	 * Values: `1` (brute-force) to `11` (fastest)
	 * @default 3
	 */
	speed?: number;

	/**
	 * Remove optional metadata.
	 * @default false
	 */
	strip?: boolean;

	/**
	 * Instructs pngquant to use the least amount of colors required to meet or exceed the max quality. If conversion results in quality below the min quality the image won't be saved.
	 * Min and max are numbers in range 0 (worst) to 1 (perfect), similar to JPEG.
	 * Values: `[0...1, 0...1]`
	 * @example [0.3, 0.5]
	 */
	quality?: [number, number];

	/**
	 * Set the dithering level using a fractional number between 0 (none) and 1 (full).
	 * Pass in `false` to disable dithering.
	 * Values: 0...1
	 * @default 1
	 */
	dithering?: number | boolean;

	/**
	 * Truncate number of least significant bits of color (per channel).
	 * Use this when image will be output on low-depth displays (e.g. 16-bit RGB). pngquant will make almost-opaque pixels fully opaque and will reduce amount of semi-transparent colors.
	 */
	posterize?: number;

	/**
	 * Print verbose status messages.
	 * @default false
	 */
	verbose?: boolean;
};

/**
 * Buffer or stream to optimize.
 * @info Banned type Buffer has been replaced in Imagemin >=8.0.1 with Uint8Array, must stick to it.
 * @see https://sindresorhus.com/blog/goodbye-nodejs-buffer [@typescript-eslint/ban-types]
 * @see https://github.com/imagemin/imagemin/compare/v8.0.1...main
 */
type Plugin = (input: Uint8Array | NodeJS.ReadableStream) => Promise<Uint8Array>;

/**
 * Imagemin plugin for pngquant.
 * @returns An Imagemin plugin.
 */
declare function imageminPngquant(options?: Options): Plugin;

export {type Options, type Plugin, imageminPngquant};
