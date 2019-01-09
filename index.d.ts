export interface Options {
   /**
    * Speed `10` has 5% lower quality, but is about 8 times faster than the default. Speed `11` disables dithering and lowers compression level.
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
    * Instructs pngquant to use the least amount of colors required to meet or exceed the max quality. If conversion results in quality below the min quality the image won't be saved.
    * Min and max are numbers in range 0 (worst) to 1 (perfect), similar to JPEG.
    * 
    * @example [0.3, 0.5]
    */
   posterize?: number;

   /**
    * Set the dithering level using a fractional number between 0 (none) and 1 (full).
    * Pass in `false` to disable dithering.
    * 
    * @default 1
    */
   quality?: string | number;

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
}

/**
 * Buffer or stream to optimize.
 *
 * @returns A `Promise` for a `Buffer`.
 */
export type Plugin = (input: Buffer | NodeJS.ReadableStream) => Promise<Buffer>

/**
 * Imagemin plugin for pngquant.
 * 
 * @returns An Imagemin plugin.
 */
export default function imageminPngquant(options?: Options): Plugin;
