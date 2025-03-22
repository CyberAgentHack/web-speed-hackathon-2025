/**
 * Shaka Playerをグローバルから取得するためのスタブファイル
 * CDNから読み込まれたShakaインスタンスを利用するために使用します
 */

// shakaの型定義
declare global {
  interface Window {
    shaka: any;
  }
}

// グローバルのshakaインスタンスを取得
const getShakaInstance = (): any => {
  if (typeof window !== 'undefined') {
    // @ts-ignore - CDNから読み込まれるshakaグローバル変数
    return window.shaka || {};
  }
  return {};
};

const shakaInstance = getShakaInstance();

// 基本的なエクスポート
export const Player = shakaInstance.Player;

// すべてのプロパティを含むオブジェクトをデフォルトエクスポート
export default shakaInstance;

// 個別のプロパティをエクスポート（必要に応じて）
export const ui = shakaInstance.ui;
export const media = shakaInstance.media;
export const net = shakaInstance.net;
export const util = shakaInstance.util;
