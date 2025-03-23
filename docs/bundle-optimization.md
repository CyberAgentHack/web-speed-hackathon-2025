# バンドル最適化実装計画

## 1. Webpack設定の最適化

### 1.1 チャンク分割の改善

現状の問題:

- `LimitChunkCountPlugin`により強制的に1チャンクに制限されている
- Code Splittingが効果的に機能していない

改善案:

```javascript
// webpack.config.mjs
export default {
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `vendor.${packageName.replace('@', '')}`;
          },
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
        },
      },
    },
  },
  // LimitChunkCountPluginを削除
};
```

### 1.2 モジュール最適化

- Tree Shakingの強化

```javascript
// webpack.config.mjs
export default {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: true,
    minimize: true,
  },
};
```

### 1.3 アセット最適化

- 画像の最適化

```javascript
{
  test: /\.(png|jpg|jpeg|gif|svg)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 4 * 1024, // 4KB
    },
  },
}
```

## 2. ポリフィルの最適化

### 2.1 core-jsの最適化

現状:

```typescript
// setups/polyfills.ts
import 'core-js';
```

改善案:

```typescript
// setups/polyfills.ts
import 'core-js/features/promise';
import 'core-js/features/array/flat';
import 'core-js/features/array/flat-map';
// 必要な機能のみをインポート
```

### 2.2 条件付きポリフィル

```typescript
// setups/conditional-polyfills.ts
async function loadPolyfills() {
  if (!('IntersectionObserver' in window)) {
    await import('intersection-observer');
  }

  if (!('ViewTransition' in document)) {
    await import('view-transitions-polyfill');
  }
}

export default loadPolyfills;
```

### 2.3 Babel設定の最適化

```javascript
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          browsers: ['last 2 versions', 'not dead', '> 0.2%'],
        },
      },
    ],
  ],
};
```

## 3. Dynamic Importの最適化

### 3.1 p-min-delayの削除

現状:

```typescript
const { HomePage } = await lazy(import('./HomePage'), 1000);
```

改善案:

```typescript
const HomePage = lazy(() => import('./HomePage'));
```

### 3.2 プリフェッチの実装

```typescript
// utils/prefetch.ts
export const prefetchComponent = (importFn: () => Promise<any>) => {
  const componentPromise = importFn();
  componentPromise.catch(() => {}); // エラーを無視
  return componentPromise;
};

// App.tsx
const HomePage = lazy(() => import('./HomePage'));
// ユーザーがホバーしたときにプリフェッチ
onHover(() => {
  prefetchComponent(() => import('./HomePage'));
});
```

## 4. パフォーマンスモニタリング

### 4.1 バンドルサイズ分析

```javascript
// webpack.config.mjs
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
    }),
  ],
};
```

### 4.2 パフォーマンスメトリクス

```typescript
// utils/performance-metrics.ts
export const measureBundlePerformance = () => {
  performance.mark('bundle-start');

  window.addEventListener('load', () => {
    performance.mark('bundle-end');
    performance.measure('bundle-load', 'bundle-start', 'bundle-end');

    const metrics = performance.getEntriesByType('measure');
    console.log('Bundle load time:', metrics[0].duration);
  });
};
```

## 実装手順

1. Webpack設定の更新

   - チャンク分割の実装
   - Tree Shakingの有効化
   - アセット最適化の設定

2. ポリフィルの最適化

   - 必要なポリフィルの特定
   - 条件付きローディングの実装
   - Babel設定の更新

3. Dynamic Importの改善

   - p-min-delayの削除
   - プリフェッチの実装
   - Suspenseの活用

4. モニタリングの実装
   - バンドルアナライザーの設定
   - パフォーマンスメトリクスの収集

## 期待される効果

1. 初期バンドルサイズの削減

   - 現状: 未計測
   - 目標: 30%以上の削減

2. ページロード時間の改善

   - First Contentful Paint: 30%改善
   - Largest Contentful Paint: 40%改善

3. キャッシュ効率の向上
   - ベンダーチャンクの分割によるキャッシュヒット率の向上
   - 共通モジュールの効果的な再利用

## 注意点

1. 後方互換性

   - ブラウザサポート範囲の明確化
   - 必要最小限のポリフィル維持

2. パフォーマンスモニタリング

   - 実装前後のメトリクス比較
   - ユーザー体験への影響測定

3. デプロイメント
   - 段階的なロールアウト
   - パフォーマンス監視の継続

# バンドル最適化実装記録

## 実装済みの改善

### 1. p-min-delayの削除（2024-03-23）

#### 変更内容

1. `createRoutes.tsx`の修正

   - p-min-delayのインポートを削除
   - React.lazyを使用するように変更
   - 1000msの強制遅延を削除

2. `package.json`の修正
   - p-min-delay依存関係を削除

#### 改善効果

- ページ遷移時の不要な1秒の遅延を解消
- より自然なコード分割とルーティング
- バンドルサイズの軽量化（p-min-delay分）

### 2. Webpack設定の最適化（2024-03-23）

#### 2.1 変更内容

1. 開発/本番環境の分離

```javascript
const isProduction = process.env.NODE_ENV === 'production';
mode: isProduction ? 'production' : 'development',
```

2. チャンク分割の最適化

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 25,
    minSize: 20000,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          return `vendor.${packageName.replace('@', '')}`;
        },
        priority: 10,
      },
      common: {
        name: 'common',
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
}
```

3. コード最適化

```javascript
optimization: {
  minimize: isProduction,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    }),
  ],
}
```

4. キャッシュの最適化

```javascript
cache: {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename],
  },
},
output: {
  chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].chunk.js',
  filename: isProduction ? '[name].[contenthash].js' : '[name].js',
}
```

5. アセット最適化

```javascript
{
  test: /\.(png|jpe?g|gif|svg|webp)$/i,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 4 * 1024, // 4KB
    },
  },
  generator: {
    filename: 'images/[hash][ext][query]',
  },
}
```

6. Babel設定の改善

```javascript
{
  loader: 'babel-loader',
  options: {
    presets: [
      ['@babel/preset-env', {
        useBuiltIns: 'usage', // entryからusageに変更
        corejs: '3.41',
      }],
    ],
    cacheDirectory: true,
  },
}
```

#### 2.2 主な改善点

1. バンドル分割の最適化

   - ベンダーコードを個別のチャンクに分割
   - 共通モジュールの効率的な再利用
   - 重複コードの削除

2. パフォーマンスの向上

   - 本番環境での最適化を強化
   - 開発環境でのビルド速度を改善
   - キャッシュ戦略の実装

3. アセット管理の改善
   - 画像の最適化
   - 効率的なキャッシュの利用
   - ファイルサイズの最適化

#### 2.3 期待される効果

1. バンドルサイズの削減

   - ベンダーコードの分割による初期ロード時間の短縮
   - 重複コードの削除による全体サイズの削減

2. キャッシュ効率の向上

   - 長期キャッシュの活用
   - 効率的な差分更新

3. ビルドパフォーマンスの改善
   - 開発時のビルド速度向上
   - 本番ビルドの最適化

## 実装予定の改善

### 3. ポリフィルの最適化

#### 3.1 新しいポリフィルの追加

```typescript
// setups/polyfills.ts
import 'core-js/features/promise';
import 'core-js/features/array/flat';
import 'core-js/features/array/flat-map';
// 必要な機能のみをインポート
```

#### 3.2 条件付きポリフィルの改善

```typescript
// setups/conditional-polyfills.ts
async function loadPolyfills() {
  if (!('IntersectionObserver' in window)) {
    await import('intersection-observer');
  }

  if (!('ViewTransition' in document)) {
    await import('view-transitions-polyfill');
  }
}

export default loadPolyfills;
```

### 4. Dynamic Importの最適化

#### 4.1 新しいDynamic Importの実装

```typescript
const HomePage = lazy(() => import('./HomePage'));
```

#### 4.2 プリフェッチの改善

```typescript
// utils/prefetch.ts
export const prefetchComponent = (importFn: () => Promise<any>) => {
  const componentPromise = importFn();
  componentPromise.catch(() => {}); // エラーを無視
  return componentPromise;
};

// App.tsx
const HomePage = lazy(() => import('./HomePage'));
// ユーザーがホバーしたときにプリフェッチ
onHover(() => {
  prefetchComponent(() => import('./HomePage'));
});
```

### 5. パフォーマンスモニタリング

#### 5.1 新しいモニタリング手法の実装

```typescript
// utils/performance-metrics.ts
export const measureBundlePerformance = () => {
  performance.mark('bundle-start');

  window.addEventListener('load', () => {
    performance.mark('bundle-end');
    performance.measure('bundle-load', 'bundle-start', 'bundle-end');

    const metrics = performance.getEntriesByType('measure');
    console.log('Bundle load time:', metrics[0].duration);
  });
};
```

[実装中...]
