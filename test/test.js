import fs from 'fs';
import isPng from 'is-png';
import pify from 'pify';
import test from 'ava';
import imageminPngquant from '../';

const fsP = pify(fs);

test.cb('optimize a PNG', t => {
	fsP.readFile('fixtures/test.png').then(buf => {
		imageminPngquant()(buf).then(data => {
			t.true(data.length < buf.length);
			t.true(isPng(data));
			t.end();
		});
	});
});

test.cb('support pngquant options', t => {
	fsP.readFile('fixtures/test.png').then(buf => {
		imageminPngquant({
			speed: 10,
			quality: 100
		})(buf).then(data => {
			t.true(data.length > 30000);
			t.true(isPng(data));
			t.end();
		});
	});
});

test.cb('skip optimizing a non-PNG file', t => {
	fsP.readFile(__filename).then(buf => {
		imageminPngquant()(buf).then(data => {
			t.is(data.length, buf.length);
			t.end();
		});
	});
});

test.cb('throw on corrupt image', t => {
	fsP.readFile('fixtures/test-corrupt.png').then(buf => {
		t.throws(imageminPngquant()(buf), /PNG file corrupted/);
		t.end();
	});
});
