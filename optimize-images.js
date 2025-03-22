const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'public/images';
const outputDir = 'public/images/optimized';

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 画像ファイルを処理
fs.readdirSync(inputDir)
  .filter(file => file.endsWith('.jpeg'))
  .forEach(async (file) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.jpeg', '.avif'));

    try {
      await sharp(inputPath)
        .avif({
          quality: 60,  // AVIF品質を60%に設定
          effort: 6,    // 圧縮の努力レベル（0-8、高いほど圧縮率が高くなる）
          chromaSubsampling: '4:4:4', // 色の品質を維持
        })
        .toFile(outputPath);

      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

      console.log(`${file}: ${(originalSize / 1024).toFixed(2)}KB → ${(optimizedSize / 1024).toFixed(2)}KB (${reduction}% 削減)`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }); 