import * as fs from 'fs';
import * as path from 'path';
import { expectType } from 'tsd-check';
import imageminPngquant from '.';

(async () => {
  const buffer = await fs.readFileSync(path.join(__dirname, 'fixture.png'));

  expectType<Buffer>(await imageminPngquant()(buffer));
  expectType<Buffer>(await imageminPngquant({
    speed: 10,
    quality: 100
  })(buffer));
})();