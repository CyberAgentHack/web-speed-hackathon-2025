import { FFmpeg } from '@ffmpeg/ffmpeg';

const isServer = typeof window === 'undefined';
const isWebWorkerSupported = typeof window !== 'undefined' && typeof window.Worker !== 'undefined';

// サーバーサイドレンダリングやWeb Worker非対応環境用のモック
class MockFFmpeg {
  async load() {
    console.log('MockFFmpeg: load called');
    return;
  }

  async exec(...args: unknown[]) {
    console.log('MockFFmpeg: exec called with', args);
    return [];
  }

  async writeFile(name: string, data: Uint8Array) {
    console.log(`MockFFmpeg: writeFile called for ${name} with ${data.byteLength} bytes`);
    return;
  }

  async readFile(name: string) {
    console.log(`MockFFmpeg: readFile called for ${name}`);
    // 空のArrayBufferを返す
    return new Uint8Array(0);
  }

  terminate() {
    console.log('MockFFmpeg: terminate called');
  }
}

// クライアント用の実装をexport
export const createFFmpeg = () => {
  // サーバー環境またはWeb Worker非対応環境ではモックを返す
  if (isServer || !isWebWorkerSupported) {
    return new MockFFmpeg();
  }

  // クライアント環境ではFFmpegのインスタンスを返す
  try {
    return new FFmpeg();
  } catch (error) {
    console.error('FFmpeg initialization error:', error);
    return new MockFFmpeg();
  }
}; 