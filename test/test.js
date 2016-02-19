import bufferEquals from 'buffer-equals';
import isPng from 'is-png';
import {read} from 'vinyl-file';
import test from 'ava';
import imageminPngquant from '../';

test.cb('optimize a PNG', t => {
	read('fixtures/test.png').then(file => {
		const stream = imageminPngquant()();
		const {length: originalSize} = file.contents;

		stream.on('data', data => {
			t.true(data.contents.length < originalSize);
			t.true(isPng(data.contents));
			t.end();
		});

		stream.end(file);
	});
});

test.cb('support pngquant options', t => {
	read('fixtures/test.png').then(file => {
		const stream = imageminPngquant({
			speed: 10,
			quality: 100
		})();

		stream.on('data', data => {
			t.true(data.contents.length > 30000);
			t.end();
		});

		stream.end(file);
	});
});

test.cb('skip optimizing a non-PNG file', t => {
	read(__filename).then(file => {
		const stream = imageminPngquant()();
		const buf = file.contents;

		stream.on('data', data => {
			t.true(bufferEquals(data.contents, buf));
			t.end();
		});

		stream.end(file);
	});
});

test.cb('skip optimizing an already optimized PNG', t => {
	read('fixtures/test-smallest.png').then(file => {
		const stream = imageminPngquant()();
		const buf = file.contents;

		stream.on('data', data => {
			t.true(bufferEquals(data.contents, buf));
			t.end();
		});

		stream.end(file);
	});
});

test.cb('emit an error when optimizing a corrupt PNG', t => {
	read('fixtures/test-corrupt.png').then(file => {
		const stream = imageminPngquant()();

		stream.on('error', err => {
			t.regex(err.message, /cannot decode image from stdin/);
			t.end();
		});

		stream.end(file);
	});
});
