'use strict';
var path = require('path');
var bufferEquals = require('buffer-equals');
var isPng = require('is-png');
var read = require('vinyl-file').read;
var test = require('ava');
var imageminPngquant = require('../');

test('optimize a PNG', function (t) {
	t.plan(3);

	read(path.join(__dirname, 'fixtures/test.png'), function (err, file) {
		t.error(err);

		var stream = imageminPngquant()();
		var size = file.contents.length;

		stream.on('data', function (data) {
			t.true(data.contents.length < size, data.contents.length);
			t.true(isPng(data.contents));
		});

		stream.end(file);
	});
});

test('skip optimizing a non-PNG file', function (t) {
	t.plan(2);

	read(__filename, function (err, file) {
		t.error(err);

		var stream = imageminPngquant()();
		var buf = file.contents;

		stream.on('data', function () {
			t.true(bufferEquals(file.contents, buf));
		});

		stream.end(file);
	});
});

test('skip optimizing an already optimized PNG', function (t) {
	t.plan(2);

	read(path.join(__dirname, 'fixtures/test-smallest.png'), function (err, file) {
		t.error(err);

		var stream = imageminPngquant()();
		var buf = file.contents;

		stream.on('data', function () {
			t.true(bufferEquals(file.contents, buf));
		});

		stream.end(file);
	});
});
