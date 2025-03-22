import sharp from "npm:sharp";

const images = Deno.readDirSync("images");
for (const image of images) {
  if (!image.isFile) continue;
  if (!image.name.endsWith(".jpeg")) continue;
  const basename = image.name.split(".")[0];
  const output = `images/${basename}.webp`;
  try {
    await Deno.stat(output);
    console.log(`${output} already exists`);
  } catch (_) {
    await sharp(`images/${image.name}`)
      .resize(1280, 720)
      .webp({ quality: 30, effort: 6 })
      .toFile(output);
  }
}

const logos = Deno.readDirSync("logos");
for (const logo of logos) {
  if (!logo.isFile) continue;
  if (!logo.name.endsWith(".svg")) continue;
  const basename = logo.name.split(".")[0];
  const output = `logos/${basename}.webp`;
  try {
    await Deno.stat(output);
    console.log(`${output} already exists`);
  } catch (_) {
    await sharp(`logos/${logo.name}`)
      .webp({ quality: 30, effort: 6 })
      .toFile(output);
  }
}
