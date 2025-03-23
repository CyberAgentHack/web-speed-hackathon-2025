import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

import { getDatabase } from '../src/drizzle/database';

const execPromise = util.promisify(exec);
// サムネイルを保存するディレクトリ
const THUMBNAILS_DIR = path.resolve(__dirname, '../thumbnails');
const STATIC_THUMBNAILS_DIR = path.resolve(__dirname, '../static/thumbnails');

// サムネイルディレクトリが存在しない場合は作成
if (!fs.existsSync(THUMBNAILS_DIR)) {
  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

// 静的サムネイルディレクトリが存在しない場合は作成
if (!fs.existsSync(STATIC_THUMBNAILS_DIR)) {
  fs.mkdirSync(STATIC_THUMBNAILS_DIR, { recursive: true });
}

// デフォルトのサムネイル画像を作成
async function createDefaultThumbnail(): Promise<void> {
  const defaultThumbnailPath = path.join(STATIC_THUMBNAILS_DIR, 'default.jpg');

  if (!fs.existsSync(defaultThumbnailPath)) {
    try {
      // FFmpegを使用してデフォルトのサムネイル画像を作成
      const command = `ffmpeg -f lavfi -i color=c=gray:s=1600x90 -frames:v 1 "${defaultThumbnailPath}" -y`;
      await execPromise(command);
      console.log('デフォルトのサムネイル画像を作成しました');
    } catch (error) {
      console.error('デフォルトのサムネイル画像の作成に失敗しました:', error);
    }
  }
}

async function generateThumbnailForEpisode(stream :string ): Promise<void> {
  // const database = getDatabase();

  // // エピソード情報を取得
  // const episode = await database.query.episode.findFirst({
  //   where(episode, { eq }) {
  //     return eq(episode.id, stream);
  //   },
  //   with: {
  //     stream: true,
  //   },
  // });

  // if (!episode) {
  //   console.error(`Episode ${stream} not found`);
  //   return;
  // }

  // 両方のディレクトリパスを設定
  const episodeDir = path.join(THUMBNAILS_DIR, stream);
  const staticThumbnailPath = path.join(STATIC_THUMBNAILS_DIR, `${stream}.jpg`);

  // エピソード用のディレクトリを作成
  if (!fs.existsSync(episodeDir)) {
    fs.mkdirSync(episodeDir, { recursive: true });
  }

  // プレイリストのパス
  const streamDir = path.resolve(__dirname, `../streams/${stream}`);
  const tsFiles = fs.readdirSync(streamDir)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(streamDir, file))
    .sort();

  if (tsFiles.length === 0) {
    console.error(`No TS files found for stream ${stream}`);
    return;
  }

  // サムネイル画像のパス
  const thumbnailPath = path.join(episodeDir, 'preview.jpg');

  // 一時的な個別サムネイルを生成
  const thumbnailPromises = [];
  const thumbnailPaths = [];

  try {
    // 動画の長さに応じてサムネイルの数を決定（最大20個）
    const numThumbnails = 30 //Math.min(20, Math.max(10, Math.ceil(tsFiles.length / 3)));
    console.log(`Generating ${numThumbnails} thumbnails for episode ${stream} (${tsFiles.length} TS files)`);

    for (let i = 0; i < numThumbnails; i++) {
      const index = Math.floor(i * tsFiles.length / numThumbnails);
      const tsFile = tsFiles[index];
      const outputPath = path.join(episodeDir, `thumbnail-${i + 1}.jpg`);
      thumbnailPaths.push(outputPath);

      const command = `ffmpeg -i "${tsFile}" -vf "select=eq(n\\,0),scale=160:90" -vframes 1 "${outputPath}" -y`;
      thumbnailPromises.push(execPromise(command));
    }

    await Promise.all(thumbnailPromises);

    // 画像を横に並べるための一時ファイルを作成
    const montageCommand = `montage ${thumbnailPaths.join(' ')} -tile ${thumbnailPaths.length}x1 -geometry 160x90+0+0 "${thumbnailPath}"`;

    try {
      // ImageMagickのmontageコマンドを試す
      await execPromise(montageCommand);

      // 成功したら静的ディレクトリにもコピー
      fs.copyFileSync(thumbnailPath, staticThumbnailPath);
    } catch (montageError) {
      console.warn('montage command failed, falling back to ffmpeg hstack:', montageError);

      // montageが失敗した場合、ffmpegのhstackフィルターを使用
      const hstackCommand = `ffmpeg -y ${thumbnailPaths.map(p => `-i "${p}"`).join(' ')} -filter_complex "hstack=inputs=${numThumbnails}" "${thumbnailPath}"`;
      await execPromise(hstackCommand);

      // 成功したら静的ディレクトリにもコピー
      fs.copyFileSync(thumbnailPath, staticThumbnailPath);
    }

    console.log(`Generated thumbnail for episode ${stream} in both directories`);
  } catch (error) {
    console.error(`Error generating thumbnail for episode ${stream}:`, error);

    // エラーが発生した場合でも、個別のサムネイルを1つだけ使用する
    try {
      const firstThumbnail = thumbnailPaths[0];
      if (thumbnailPaths.length > 0 && firstThumbnail && fs.existsSync(firstThumbnail)) {
        fs.copyFileSync(firstThumbnail, thumbnailPath);
        // 静的ディレクトリにもコピー
        fs.copyFileSync(firstThumbnail, staticThumbnailPath);
        console.log(`Fallback: Using single thumbnail for episode ${stream} in both directories`);
      }
    } catch (fallbackError) {
      console.error(`Fallback also failed for episode ${stream}:`, fallbackError);
    }

    throw error;
  } finally {
    // 個別のサムネイルを削除
    for (const tmpPath of thumbnailPaths) {
      if (fs.existsSync(tmpPath)) {
        try {
          fs.unlinkSync(tmpPath);
        } catch (e) {
          console.warn(`Failed to delete temporary file ${tmpPath}:`, e);
        }
      }
    }
  }
}

async function generateAllThumbnails(): Promise<void> {
  const database = getDatabase();

  // すべてのエピソードを取得
  const episodes = await database.query.episode.findMany({
    with: {
      stream: true,
    },
  });

  console.log(`Generating thumbnails for ${episodes.length} episodes...`);

  // 各エピソードのサムネイルを生成
  for (const episode of episodes) {
    try {
      await generateThumbnailForEpisode(episode.id);
    } catch (error) {
      console.error(`Error processing episode ${episode.id}:`, error);
    }
  }

  console.log('Thumbnail generation complete');
}

// メイン処理
async function main() {
  try {
    // まずデフォルトのサムネイル画像を作成
    await createDefaultThumbnail();

    // ストリームごとのデフォルトサムネイルを作成
    const streamIds = ['caminandes2', 'dailydweebs', 'glasshalf', 'wing-it'];
    for (const streamId of streamIds) {
      const streamThumbnailPath = path.join(STATIC_THUMBNAILS_DIR, `${streamId}.jpg`);
      if (!fs.existsSync(streamThumbnailPath)) {
        try {
          // デフォルトのサムネイル画像をコピー
          fs.copyFileSync(path.join(STATIC_THUMBNAILS_DIR, 'default.jpg'), streamThumbnailPath);
          console.log(`ストリーム ${streamId} のサムネイル画像を作成しました`);
        } catch (error) {
          console.error(`ストリーム ${streamId} のサムネイル画像の作成に失敗しました:`, error);
        }
      }
    }

    // すべてのエピソードのサムネイルを生成
    await generateAllThumbnails();
  } catch (error) {
    console.error('Error generating thumbnails:', error);
    process.exit(1);
  }
}

// このファイルが直接実行された場合のみmain()を実行
if (require.main === module) {
  main();
}

export default main;
export { generateThumbnailForEpisode };
