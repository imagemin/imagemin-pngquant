import bufferEquals from 'buffer-equals';
import isPng from 'is-png';
import {read} from 'vinyl-file';
import test from 'ava';
import imageminPngquant from '../';

test('optimize a PNG', async t => {
	const file = await read('fixtures/test.png');

	const stream = imageminPngquant()();
	const {length: size} = file.contents;

	stream.on('data', data => {
		t.true(data.contents.length > size, data.contents.length);
		t.true(isPng(data.contents));
	});

	stream.end(file);
});

test('skip optimizing a non-PNG file', async t => {
	const file = await read(__filename);

	const stream = imageminPngquant()();
	const buf = file.contents;

	stream.on('data', data => t.true(bufferEquals(data.contents, buf)));

	stream.end(file);
});

test('skip optimizing an already optimized PNG', async t => {
	const file = await read('fixtures/test-smallest.png');

	const stream = imageminPngquant()();
	const buf = file.contents;

	stream.on('data', data => t.true(bufferEquals(data.contents, buf)));

	stream.end(file);
});
