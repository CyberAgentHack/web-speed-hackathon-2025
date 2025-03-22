/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { text } from 'node:stream/consumers';

import iconv from 'iconv-lite';
import JSZip from 'jszip';
import mikan from 'mikanjs';

export async function fetchLoremIpsumWordList(): Promise<string[]> {
  const zipBinary = await fetch('https://www.aozora.gr.jp/cards/000148/files/789_ruby_5639.zip').then((r) =>
    r.arrayBuffer(),
  );

  const zip = await JSZip.loadAsync(zipBinary);
  const file = zip.file('wagahaiwa_nekodearu.txt')!;
  const _text = await text(file.nodeStream().pipe(iconv.decodeStream('Shift_JIS')));
  const trimmed = _text.replace(/《.*?》|｜|※?［.*?］|\s|\n/g, '').slice(398, 10000);
  return mikan.split(trimmed).map((w) => w.replace(/。|、|「|」|―/g, ''));
}
