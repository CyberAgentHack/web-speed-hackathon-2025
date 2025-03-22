const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizeImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);
    console.log(`Optimized: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
};

const optimizeSvg = async (inputPath) => {
  try {
    const svgContent = fs.readFileSync(inputPath, 'utf8');
    // 基本的なSVG最適化
    const optimizedSvg = svgContent
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    fs.writeFileSync(inputPath, optimizedSvg);
    console.log(`Optimized SVG: ${inputPath}`);
  } catch (error) {
    console.error(`Error optimizing SVG ${inputPath}:`, error);
  }
};

const processDirectory = async (dir) => {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const stat = fs.statSync(inputPath);
    
    if (stat.isDirectory()) {
      await processDirectory(inputPath);
      continue;
    }
    
    if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
      const outputPath = inputPath.replace(/\.(jpeg|jpg)$/, '.webp');
      await optimizeImage(inputPath, outputPath);
    } else if (file.endsWith('.svg')) {
      await optimizeSvg(inputPath);
    }
  }
};

const publicDir = path.join(__dirname, '../public');
processDirectory(publicDir).catch(console.error); 
