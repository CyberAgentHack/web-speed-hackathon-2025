/* eslint-disable import/order */
import sharp from 'npm:sharp';
import { extname, parse } from 'https://deno.land/std@0.201.0/path/mod.ts';
import $ from 'https://deno.land/x/dax@0.28.0/mod.ts';

const img2avif = async (input: string, output: string, resize?: number) =>
  await sharp(input)
    .resize(resize)
    .avif({ quality: 18 })
    .toFile(output)
    .then(() => console.log(`Compressed ${input} to ${output}`));

const jxl2png = async (input: string) => {
  const output = input.replace('.jxl', '.png');
  await $`djxl ${input} ${output}`.then(() => console.log(`Converted ${input} to ${output}`));
};

const list_files = async (path: string) => {
  const lists: string[] = await $`cd ${path} && ls`.lines();
  return lists;
};

const images_path = '../public/images';
const images = await list_files(images_path);

await Promise.all([
  ...images
    .filter((filename) => filename.endsWith('.jpeg'))
    .map((filename) => filename.replace('.jpeg', ''))
    .flatMap((filename) =>
      (async () => {
        const input = `${images_path}/${filename}.jpeg`;
        const output = `${images_path}/${filename}.avif`;
        await img2avif(input, output);
      })(),
    ),
]);
