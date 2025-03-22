// ShakaPlayerをブラウザ互換の方法でロードするためのヘルパーファイル
interface ShakaPlayer {
  Player: any;
  // 他の必要なタイプを追加
}

// 非nullアサーションがないため、明示的に処理する
let shakaInstance: ShakaPlayer | null = null;

export async function loadShaka(): Promise<ShakaPlayer> {
  // すでに初期化済みの場合はそれを返す
  if (shakaInstance) {
    return shakaInstance;
  }

  // まず、グローバルのshakaが存在するか確認（CDNからの読み込み用）
  if (typeof window !== 'undefined') {
    // compiled.js (nomodule版) からのグローバルshaka
    if ((window as any).shaka) {
      console.log('Using global Shaka Player from CDN (compiled.js)');
      shakaInstance = (window as any).shaka;
      return shakaInstance as ShakaPlayer;
    }

    // ui.js (module版) からのグローバルshaka
    await new Promise((resolve) => setTimeout(resolve, 300));
    if ((window as any).shaka) {
      console.log('Using global Shaka Player from CDN (ui.js)');
      shakaInstance = (window as any).shaka;
      return shakaInstance as ShakaPlayer;
    }
  }

  try {
    // 動的インポート（最終手段としてのフォールバック）
    console.log('Trying to load Shaka Player via dynamic import');

    // importでのロードを試みる
    let shakaModule;
    try {
      const module = await import('shaka-player');
      shakaModule = module.default || module;

      if (!shakaModule) {
        throw new Error('Module loaded but is undefined');
      }
    } catch (importError) {
      console.warn('Import failed, trying with window.shaka as fallback', importError);

      // 最後の手段: window.shakaが少し遅れて利用可能になる場合がある
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if ((window as any).shaka) {
        shakaModule = (window as any).shaka;
      } else {
        throw new Error('Failed to load Shaka Player: Not available globally or via import');
      }
    }

    shakaInstance = shakaModule as ShakaPlayer;
    return shakaInstance;
  } catch (error) {
    console.error('Failed to load Shaka Player:', error);
    throw new Error(`Shaka Player loading failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
