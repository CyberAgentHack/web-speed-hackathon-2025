/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readFile } from 'node:fs/promises';
import { text } from 'node:stream/consumers';

import iconv from 'iconv-lite';
import JSZip from 'jszip';
import mikan from 'mikanjs';

export async function fetchLoremIpsumWordList(): Promise<string[]> {
  // Read local zip file
  const zipBinary = await readFile('./789_ruby_5639.zip');

  const zip = await JSZip.loadAsync(zipBinary);
  const file = zip.file('wagahaiwa_nekodearu.txt')!;
  const _text = await text(file.nodeStream().pipe(iconv.decodeStream('Shift_JIS')));
  const trimmed = _text.replace(/《.*?》|｜|※?［.*?］|\s|\n/g, '').slice(398, 10000);
  return mikan.split(trimmed).map((w) => w.replace(/。|、|「|」|―/g, ''));
}
