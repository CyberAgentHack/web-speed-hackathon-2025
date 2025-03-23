#!/usr/bin/env node

/**
 * JPEG画像をAVIF形式に変換するスクリプト
 * 
 * このスクリプトは、指定されたディレクトリ内のJPEG画像ファイルをAVIF形式に変換します。
 * AVIF形式は次世代の画像圧縮形式で、優れた圧縮率と画質を持ちます。
 * 
 * 使用方法:
 * node jpeg-to-avif.js
 * 
 * 必要なライブラリ:
 * - sharp: `npm install sharp`
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 設定パラメータ
const INPUT_DIR = 'public/images';  // 入力ディレクトリ（JPEGファイルが格納されているディレクトリ）
const OUTPUT_DIR = 'public/images';  // 出力ディレクトリ（同じディレクトリに出力）
const QUALITY = 50;  // AVIF品質（1-100）、値が低いほどファイルサイズが小さくなるが、画質は低下
const EFFORT = 7;    // 圧縮の努力レベル（0-9）、値が高いほど処理に時間がかかるが圧縮率が向上

/**
 * JPEG画像をAVIF形式に変換する関数
 * @param {string} jpegPath - 変換するJPEG画像のパス
 * @param {string} avifPath - 出力するAVIF画像のパス
 * @returns {Promise} - 変換処理のPromise
 */
async function convertJpegToAvif(jpegPath, avifPath) {
  try {
    // AVIF形式に変換して保存
    await sharp(jpegPath)
      .avif({
        quality: QUALITY,
        effort: EFFORT
      })
      .toFile(avifPath);
    
    // ファイルサイズ情報を取得
    const jpegStats = fs.statSync(jpegPath);
    const avifStats = fs.statSync(avifPath);
    
    // KB単位のサイズ
    const jpegSize = jpegStats.size / 1024;
    const avifSize = avifStats.size / 1024;
    
    // 圧縮率を計算
    const compressionRatio = (1 - avifSize / jpegSize) * 100;
    
    console.log(`変換完了: ${path.basename(jpegPath)} → ${path.basename(avifPath)}`);
    console.log(`  元のサイズ: ${jpegSize.toFixed(2)} KB`);
    console.log(`  AVIFサイズ: ${avifSize.toFixed(2)} KB`);
    console.log(`  圧縮率: ${compressionRatio.toFixed(2)}%`);
    
    return { success: true };
  } catch (error) {
    console.error(`エラー: ${jpegPath} の変換中にエラーが発生しました - ${error.message}`);
    return { success: false, error };
  }
}

/**
 * ディレクトリ内のすべてのJPEG画像をAVIF形式に変換する関数
 */
async function batchConvertDirectory() {
  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // ディレクトリ内のファイル一覧を取得
  const files = fs.readdirSync(INPUT_DIR);
  
  // JPEG/JPGファイルのみをフィルタリング
  const jpegFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpeg' || ext === '.jpg';
  });
  
  if (jpegFiles.length === 0) {
    console.log(`変換対象のJPEG画像が ${INPUT_DIR} に見つかりませんでした。`);
    return;
  }
  
  console.log(`合計 ${jpegFiles.length} 個のJPEG画像を変換します...`);
  
  // 変換開始時間を記録
  const startTime = Date.now();
  
  // 変換カウンター
  let successCount = 0;
  let errorCount = 0;
  
  // 各ファイルを順番に変換
  for (const jpegFile of jpegFiles) {
    const jpegPath = path.join(INPUT_DIR, jpegFile);
    const avifFile = path.basename(jpegFile, path.extname(jpegFile)) + '.avif';
    const avifPath = path.join(OUTPUT_DIR, avifFile);
    
    // 変換を実行
    const result = await convertJpegToAvif(jpegPath, avifPath);
    
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  // 処理時間を計算
  const elapsedTime = (Date.now() - startTime) / 1000;
  
  // 結果を表示
  console.log("\n変換処理が完了しました。");
  console.log(`  成功: ${successCount} 個`);
  console.log(`  失敗: ${errorCount} 個`);
  console.log(`  処理時間: ${elapsedTime.toFixed(2)} 秒`);
}

// メイン処理を実行
console.log("JPEG画像をAVIF形式に変換するプロセスを開始します...");
batchConvertDirectory()
  .then(() => console.log("処理が完了しました。"))
  .catch(error => console.error("エラーが発生しました:", error)); 