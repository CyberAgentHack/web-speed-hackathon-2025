import 'core-js/features/promise';
import 'core-js/features/array/flat';
import 'core-js/features/array/flat-map';
import 'setimmediate';

// view-transitions-polyfillを安全に初期化
if (typeof window !== 'undefined') {
  try {
    // カスタム要素が既に定義されているか確認
    if (!customElements.get('view-transition-media')) {
      // 定義されていなければポリフィルをロード
      import('view-transitions-polyfill')
        .catch(error => { console.warn('Failed to load view-transitions-polyfill:', error); });
    }
  } catch (error) {
    console.warn('Failed to check or load view-transitions-polyfill:', error);
  }
}
