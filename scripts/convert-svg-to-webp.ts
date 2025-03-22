import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const [inputDir, outputDir] = process.argv.slice(2);

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter((file) => path.extname(file).toLowerCase() === '.svg');

files.forEach((file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, `${path.basename(file, '.svg')}.webp`);

  sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(() => console.log(`Converted: ${file} → ${outputPath}`));
});
