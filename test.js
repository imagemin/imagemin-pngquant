import {promisify} from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import url, {fileURLToPath} from 'node:url';
import test from 'ava';
import isPng from 'is-png';
import imageminPngquant from './index.js';

const readFile = promisify(fs.readFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const thisFilename = url.fileURLToPath(import.meta.url);

test('optimize a PNG', async t => {
	const buffer = await readFile(path.join(__dirname, 'fixture.png'));
	const data = await imageminPngquant()(buffer);
	t.true(data.length < buffer.length);
	t.true(isPng(data));
});

test('support pngquant options', async t => {
	const buffer = await readFile(path.join(__dirname, 'fixture.png'));
	const data = await imageminPngquant({
		speed: 10,
		quality: [0.8, 1],
		strip: false,
		dithering: false,
		posterize: 1,
	})(buffer);
	t.true(data.length > (30 * 1000));
	t.true(isPng(data));
});

test('skip optimizing a non-PNG file', async t => {
	const buffer = await readFile(thisFilename);
	const data = await imageminPngquant()(buffer);
	t.is(data.length, buffer.length);
});

test('handles non-buffer, non-stream input', async t => {
	const badInput = {};
	await t.throwsAsync(imageminPngquant()(badInput), {
		message: `Expected a Uint8Array, got ${typeof badInput}`,
	});
});
