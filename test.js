import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import pify from 'pify';
import test from 'ava';
import m from './';

const fsP = pify(fs);

test('optimize a PNG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture.png'));
	const data = await m()(buf);

	t.true(data.length < buf.length);
	t.true(isPng(data));
});

test('support pngquant options', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture.png'));
	const data = await m({
		speed: 10,
		quality: 100
	})(buf);

	t.true(data.length > 30000);
	t.true(isPng(data));
});

test('skip optimizing a non-PNG file', async t => {
	const buf = await fsP.readFile(__filename);
	const data = await m()(buf);

	t.is(data.length, buf.length);
});

test('throw on corrupt image', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture-corrupt.png'));
	t.throws(m()(buf), /PNG file corrupted/);
});

test('return original buffer on err.code===99 (not compressible at quality requested)', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture-no-compress.png'));
	const data = await m({quality: 100})(buf);
	t.true(data.length === buf.length);
	t.true(isPng(data));
});
