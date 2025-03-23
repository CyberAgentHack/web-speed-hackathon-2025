const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sourceDir = './public/images';
const targetDir = './public/images-webp';

async function convertToWebp() {
  try {
    // ターゲットディレクトリが存在しない場合は作成
    await fs.mkdir(targetDir, { recursive: true });

    // ソースディレクトリ内のファイル一覧を取得
    const files = await fs.readdir(sourceDir);

    // JPEGファイルのみを処理
    const jpegFiles = files.filter(
      (file) => file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg'),
    );

    for (const file of jpegFiles) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, `${path.parse(file).name}.webp`);

      await sharp(sourcePath)
        .webp({
          quality: 1, // 低品質設定（1-100）
          effort: 6, // 圧縮レベル（0-6）
        })
        .toFile(targetPath);

      console.log(`Converted: ${file} -> ${path.parse(file).name}.webp`);
    }

    console.log('All images have been converted successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertToWebp();
