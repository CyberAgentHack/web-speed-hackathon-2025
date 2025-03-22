/**
 * WebWorkerのモック
 * importScriptsが未定義のエラーを回避するためのモック
 */

// 空のオブジェクトをエクスポート
export default {
  FFmpeg: function () {
    return {
      load: async () => console.log('Mock FFmpeg loaded'),
      exec: async () => console.log('Mock FFmpeg exec called'),
    };
  },
};

// onmessageをモック
self.onmessage = function (e) {
  console.log('Mock worker received message', e.data);
  // レスポンスを返す
  self.postMessage({ type: 'done' });
};

// 他の必要なメソッドも同様にモック
