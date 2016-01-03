# imagemin-pngquant [![Build Status](https://travis-ci.org/imagemin/imagemin-pngquant.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-pngquant) [![Build status](https://ci.appveyor.com/api/projects/status/w60auppnbiwgu9gj?svg=true)](https://ci.appveyor.com/project/kevva/imagemin-pngquant)

> pngquant imagemin plugin


## Install

```
$ npm install --save imagemin-pngquant
```


## Usage

```js
const Imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const Imagemin()
	.src('images/*.png')
	.dest('build/images')
	.use(imageminPngquant({quality: '65-80', speed: 4}))
	.run();
```

You can also use this plugin with [gulp](http://gulpjs.com):

```js
const gulp = require('gulp');
const imageminPngquant = require('imagemin-pngquant');

gulp.task('default', () => {
	return gulp.src('images/*.png')
		.pipe(imageminPngquant({quality: '65-80', speed: 4})())
		.pipe(gulp.dest('build/images'));
});
```


## API

### imageminPngquant(options)

#### options.floyd

Type: `number`, `boolean`  
Default: `0.5`

Controls level of dithering (0 = none, 1 = full).

#### options.nofs

Type: `boolean`  
Default: `false`

Disable Floyd-Steinberg dithering.

#### options.posterize

Type: `number`

Reduce precision of the palette by number of bits. Use when the image will be 
displayed on low-depth screens (e.g. 16-bit displays or compressed textures).

#### options.quality

Type: `string`

Instructs pngquant to use the least amount of colors required to meet or exceed 
the max quality. If conversion results in quality below the min quality the 
image won't be saved.

Min and max are numbers in range 0 (worst) to 100 (perfect), similar to JPEG.

#### options.speed

Type: `number`  
Default: `3`

Speed/quality trade-off from `1` (brute-force) to `10` (fastest). Speed `10` has 
5% lower quality, but is 8 times faster than the default.

#### options.verbose

Type: `boolean`  
Default: `false`

Print verbose status messages.


## License

MIT © [imagemin](https://github.com/imagemin)
