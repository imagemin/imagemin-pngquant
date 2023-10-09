import {promisify} from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import test from 'ava';
import getStream from 'get-stream';
import isPng from 'is-png';
import imageminPngquant from './index.js';

const readFile = promisify(fs.readFile);
const thisDirname = url.fileURLToPath(new URL('.', import.meta.url));
const thisFilename = url.fileURLToPath(import.meta.url);

test('optimize a PNG', async t => {
	const buffer = await readFile(path.join(thisDirname, 'fixture.png'));
	const data = await imageminPngquant()(buffer);
	t.true(data.length < buffer.length);
	t.true(isPng(data));
});

test('support pngquant options', async t => {
	const buffer = await readFile(path.join(thisDirname, 'fixture.png'));
	const data = await imageminPngquant({
		speed: 10,
		quality: [0.8, 1],
		strip: true,
		dithering: false,
		posterize: 1,
		verbose: false,
	})(buffer);
	t.true(data.length > (30 * 1000));
	t.true(isPng(data));
});

test('support streams', async t => {
	const buffer = await readFile(path.join(thisDirname, 'fixture.png'));
	const stream = fs.createReadStream(path.join(thisDirname, 'fixture.png'));
	const data = await getStream.buffer(imageminPngquant()(stream));
	t.true(data.length < buffer.length);
	t.true(isPng(data));
});

test('skip optimizing a non-PNG file', async t => {
	const buffer = await readFile(thisFilename);
	const data = await imageminPngquant()(buffer);
	t.is(data.length, buffer.length);
});

test('handles non-buffer, non-stream input', t => {
	const badInput = {};
	return t.throwsAsync(() => imageminPngquant()(badInput), {
		message: `Expected a Buffer or Stream, got ${typeof badInput}`,
	});
});
