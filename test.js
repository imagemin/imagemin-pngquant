import fs from 'fs';
import path from 'path';
import test from 'ava';
import getStream from 'get-stream';
import isPng from 'is-png';
import imageminPngquant from '.';

test('optimize a PNG', async t => {
	const buffer = await fs.readFileSync(path.join(__dirname, 'fixture.png'));
	const data = await imageminPngquant()(buffer);
	t.true(data.length < buffer.length);
	t.true(isPng(data));
});

test('support pngquant options', async t => {
	const buffer = await fs.readFileSync(path.join(__dirname, 'fixture.png'));
	const data = await imageminPngquant({
		speed: 10,
		quality: [0.8, 1]
	})(buffer);
	t.true(data.length > 30000);
	t.true(isPng(data));
});

test('support streams', async t => {
	const buffer = await fs.readFileSync(path.join(__dirname, 'fixture.png'));
	const stream = fs.createReadStream(path.join(__dirname, 'fixture.png'));
	const data = await getStream.buffer(imageminPngquant()(stream));
	t.true(data.length < buffer.length);
	t.true(isPng(data));
});

test('skip optimizing a non-PNG file', async t => {
	const buffer = await fs.readFileSync(__filename);
	const data = await imageminPngquant()(buffer);
	t.is(data.length, buffer.length);
});

test('skip optimizing a fully optimized PNG', async t => {
	const buffer = await fs.readFileSync(path.join(__dirname, 'fixture-no-compress.png'));
	const data = await imageminPngquant({quality: [0.8, 1]})(buffer);
	t.is(data.length, buffer.length);
	t.true(isPng(data));
});
