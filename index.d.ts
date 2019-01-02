export interface Options {
  /**
   * Controls level of dithering (0 = none, 1 = full).
   * 
   * @default 0.5
   */
  floyd?: number | boolean;

  /**
   * Disable Floyd-Steinberg dithering.
   * 
   * @default false
   */
  nofs?: boolean;

  /**
   * Reduce precision of the palette by number of bits. Use when the image will be displayed on low-depth screens (e.g. 16-bit displays or compressed textures).
   */
  posterize?: number;

  /**
   * Instructs pngquant to use the least amount of colors required to meet or exceed the max quality. If conversion results in quality below the min quality the image won't be saved.
   * Min and max are numbers in range 0 (worst) to 100 (perfect), similar to JPEG.
   */
  quality?: number;

  /**
   * Speed/quality trade-off from 1 (brute-force) to 10 (fastest). Speed 10 has 5% lower quality, but is 8 times faster than the default.
   * 
   * @default 3
   */
  speed?: number;

  /**
   * Print verbose status messages.
   * 
   * @default false
   */
  verbose?: boolean;

  /**
   * Remove optional metadata.
   * 
   * @default false (true on macOS)
   */
  strip?: boolean;

  /**
   * Buffer or stream to optimize.
   */
  input?: Buffer | NodeJS.ReadableStream;
}

/**
 * Buffer or stream to optimize.
 *
 * @returns A `Promise` for a `Buffer`.
 */
export type Plugin = (input: Buffer | NodeJS.ReadableStream) => Promise<Buffer>

/**
 * Pngquant imagemin plugin.
 * 
 * @returns An imagemin plugin.
 */
export default function imageminPngquant(options?: Options): Plugin;