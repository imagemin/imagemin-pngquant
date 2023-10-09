import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import {expectType} from 'tsd';
import pngquant from './index.js';

const thisDirname = url.fileURLToPath(new URL('.', import.meta.url));
const buffer = fs.readFileSync(path.join(thisDirname, 'fixture.png'));

async function test() {
	expectType<Buffer>(await pngquant()(buffer));
	expectType<Buffer>(await pngquant({
		speed: 10,
		quality: [0.8, 1],
	})(buffer));
}

await test();
