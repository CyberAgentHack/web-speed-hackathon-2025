/* eslint-disable @typescript-eslint/no-non-null-assertion */
import iconv from 'iconv-lite';
import JSZip from 'jszip';
import mikan from 'mikanjs';

export async function fetchLoremIpsumWordList(): Promise<string[]> {
  const zipBinary = await fetch('https://www.aozora.gr.jp/cards/000148/files/789_ruby_5639.zip').then((r) =>
    r.arrayBuffer(),
  );

  const zip = await JSZip.loadAsync(zipBinary);
  const file = zip.file('wagahaiwa_nekodearu.txt')!;
  const fileBuffer = await file.async('nodebuffer');
  const decodedText = iconv.decode(fileBuffer, 'Shift_JIS');
  const trimmed = decodedText
    .slice(398, 10000) // 先にスライス
    .replace(/《.*?》|｜|※?［.*?］|[\s\n。、「」―]/g, '');
  return mikan.split(trimmed);
}
