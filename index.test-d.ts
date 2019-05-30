import * as fs from 'fs';
import * as path from 'path';
import {expectType} from 'tsd';
import imageminPngquant from '.';

const buffer = await fs.readFileSync(path.join(__dirname, 'fixture.png'));

expectType<Buffer>(await imageminPngquant()(buffer));
expectType<Buffer>(await imageminPngquant({
	speed: 10,
	quality: [0.8, 1]
})(buffer));
