import fs from 'fs';
import path from 'path';
import getStream from 'get-stream';
import isPng from 'is-png';
import test from 'ava';
import m from '.';

test('optimize a PNG', async t => {
	const buf = await fs.readFileSync(path.join(__dirname, 'fixture.png'));
	const data = await m()(buf);

	t.true(data.length < buf.length);
	t.true(isPng(data));
});

test('support pngquant options', async t => {
	const buf = await fs.readFileSync(path.join(__dirname, 'fixture.png'));
	const data = await m({
		speed: 10,
		quality: 100
	})(buf);

	t.true(data.length > 30000);
	t.true(isPng(data));
});

test('support streams', async t => {
	const buf = await fs.readFileSync(path.join(__dirname, 'fixture.png'));
	const stream = fs.createReadStream(path.join(__dirname, 'fixture.png'));
	const data = await getStream.buffer(m()(stream));

	t.true(data.length < buf.length);
	t.true(isPng(data));
});

test('skip optimizing a non-PNG file', async t => {
	const buf = await fs.readFileSync(__filename);
	const data = await m()(buf);

	t.is(data.length, buf.length);
});

test('skip optimizing a fully optimized PNG', async t => {
	const buf = await fs.readFileSync(path.join(__dirname, 'fixture-no-compress.png'));
	const data = await m({quality: 100})(buf);
	t.is(data.length, buf.length);
	t.true(isPng(data));
});
