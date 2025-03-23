import path from 'node:path';

import webpack from 'webpack';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'inline-source-map',
  entry: './src/main.tsx',
  mode: 'production',
  module: {
    rules: [
      {
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/, /node_modules\/react-dom\/cjs\/react-dom-client\.development\.js|node_modules\/lodash\/lodash\.js/],
        resolve: {
          fullySpecified: false,
        },
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: '3.41',
                  forceAllTransforms: true,
                  targets: 'defaults',
                  useBuiltIns: 'entry',
                  // modules: false,
                },
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript'],
            ],
          },
        },
      },
      {
        test: /\.png$/,
        type: 'asset/inline',
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
      {
        resourceQuery: /arraybuffer/,
        type: 'javascript/auto',
        use: {
          loader: 'arraybuffer-loader',
        },
      },
    ],
  },
  output: {
    chunkFilename: '[name]-[contenthash].js',
    chunkFormat: false,
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  // optimization: {
  //   // concatenateModules: false, // モジュール結合を無効化
  //   splitChunks: {
  //     chunks: 'all', // すべてのチャンクに適用
  //     minSize: 20000, // 分割する最小サイズ（デフォルト: 20KB）
  //     maxSize: 0, // 最大サイズ（0は無制限）
  //     minChunks: 1, // モジュールがいくつのチャンクで共有されるか
  //     automaticNameDelimiter: '-', // 名前の区切り文字
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10, // 優先度
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true, // 既存のチャンクを再利用
  //       },
  //     },
  //   },
  //   // runtimeChunk: 'single', // ランタイムを1つのファイルに分離
  // },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    // ...(process.env.ANALYZE
    //   ? [
    //       new BundleAnalyzerPlugin({
    //         analyzerMode: 'server', // サーバーモードでブラウザに出力
    //         analyzerPort: 8888,    // ポート番号
    //         openAnalyzer: true,    // 自動でブラウザを開く
    //       }),
    //     ]
    //   : []),
  ],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
