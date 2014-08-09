/*global describe, it */
'use strict';

var assert = require('assert');
var fs = require('fs');
var Imagemin = require('image-min');
var pngquant = require('../');
var path = require('path');

describe('pngquant()', function () {
    it('should optimize a PNG', function (cb) {
        var imagemin = new Imagemin();

        imagemin
            .src(path.join(__dirname, 'fixtures/test.png'))
            .use(pngquant({ quality: '65-80', speed: 4 }))
            .optimize(function (err, file) {
                assert(file.contents.length < fs.statSync(imagemin.src()).size);
                assert(file.contents.length > 0);
                cb();
            });
    });
});
