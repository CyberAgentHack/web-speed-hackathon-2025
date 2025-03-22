import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const targetDir = '../../public/images';
const quality = 50;
const width = 1440;
const height = 810;

async function compressAndResizeAvif(filePath: string) {
  try {
    const data = await sharp(filePath)
      .resize(width, height, { fit: 'cover' })
      .avif({
        quality,
        effort: 5,
        chromaSubsampling: '4:4:4',
      })
      .toBuffer();

    await fs.promises.writeFile(filePath, data);
    console.log(`Compressed & resized: ${filePath}`);
  } catch (err) {
    console.error(`Failed to process ${filePath}:`, err);
  }
}

async function walkAndProcess(dir: string) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAndProcess(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.avif')) {
      await compressAndResizeAvif(fullPath);
    }
  }
}

(async () => {
  await walkAndProcess(targetDir);
  console.log('All AVIF files processed.');
})();
