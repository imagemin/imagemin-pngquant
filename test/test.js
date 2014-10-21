'use strict';

var bufferEqual = require('buffer-equal');
var isPng = require('is-png');
var pngquant = require('../');
var path = require('path');
var read = require('vinyl-file').read;
var test = require('ava');

test('optimize a PNG', function (t) {
	t.plan(3);

	read(path.join(__dirname, 'fixtures/test.png'), function (err, file) {
		t.assert(!err, err);

		var stream = pngquant();
		var size = file.contents.length;

		stream.on('data', function (data) {
			t.assert(data.contents.length < size);
			t.assert(isPng(data.contents));
		});

		stream.end(file);
	});
});

test('optimize a PNG using ctor', function (t) {
	t.plan(3);

	var Pngquant = pngquant.ctor();

	read(path.join(__dirname, 'fixtures/test.png'), function (err, file) {
		t.assert(!err, err);

		var stream = new Pngquant();
		var size = file.contents.length;

		stream.on('data', function (data) {
			t.assert(data.contents.length < size);
			t.assert(isPng(data.contents));
		});

		stream.end(file);
	});
});

test('skip optimizing a non-PNG file', function (t) {
	t.plan(2);

	read(__filename, function (err, file) {
		t.assert(!err, err);

		var stream = pngquant();
		var buf = file.contents;

		stream.on('data', function (data) {
			t.assert(bufferEqual(file.contents, buf));
		});

		stream.end(file);
	});
});

test('skip optimizing an already optimized PNG', function (t) {
	t.plan(2);

	read(path.join(__dirname, 'fixtures/test-smallest.png'), function (err, file) {
		t.assert(!err, err);

		var stream = pngquant();
		var buf = file.contents;

		stream.on('data', function (data) {
			t.assert(bufferEqual(file.contents, buf));
		});

		stream.end(file);
	});
});
