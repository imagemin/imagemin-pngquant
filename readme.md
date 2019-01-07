# imagemin-pngquant [![Build Status](https://travis-ci.org/imagemin/imagemin-pngquant.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-pngquant) [![Build status](https://ci.appveyor.com/api/projects/status/w60auppnbiwgu9gj?svg=true)](https://ci.appveyor.com/project/kevva/imagemin-pngquant)

> pngquant imagemin plugin


## Install

```
$ npm install imagemin-pngquant
```


## Usage

```js
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

imagemin(['images/*.png'], 'build/images', {use: [imageminPngquant()]}).then(() => {
	console.log('Images optimized');
});
```


## API

### imageminPngquant([options])(input)

Returns a `Promise` for a `Buffer`.

#### options

Type: `Object`

##### dithering

Type: `number` `boolean`<br>
Default: `1` (full)

Set the dithering level using a fractional number between 0 (none) and 1 (full).

Pass in `false` to disable dithering.

##### posterize

Type: `number`

Reduce precision of the palette by number of bits. Use when the image will be
displayed on low-depth screens (e.g. 16-bit displays or compressed textures).

##### quality

Type: `number`

Instructs pngquant to use the least amount of colors required to meet or exceed
the max quality. If conversion results in quality below the min quality the
image won't be saved.

Min and max are numbers in range 0 (worst) to 100 (perfect), similar to JPEG.

##### speed

Type: `number`<br>
Default: `3`

Speed/quality trade-off from `1` (brute-force) to `10` (fastest). Speed `10` has
5% lower quality, but is 8 times faster than the default.

##### verbose

Type: `boolean`<br>
Default: `false`

Print verbose status messages.

##### strip

Type: `boolean`<br>
Default: `false` (`true` on macOS)

Remove optional metadata.

#### input

Type: `Buffer` `Stream`

Buffer or stream to optimize.


## License

MIT © [Imagemin](https://github.com/imagemin)
