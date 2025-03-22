import path from 'node:path';

import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// 基本プラグイン
const basePlugins = [
  new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
];

const plugins = process.env['ANALYZE'] === 'true'
  ? [
    ...basePlugins,
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: true,
    })
  ]
  : basePlugins;

/** @type {import('webpack').Configuration} */
const config = {
  devtool: process.env['NODE_ENV'] === 'production' ? false : 'inline-source-map',
  entry: './src/main.tsx',
  mode: process.env['NODE_ENV'] === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
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
                  targets: {
                    chrome: '130',
                  },
                  useBuiltIns: 'usage', // 使用している機能のみポリフィル
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
  // 最適化設定を追加
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 30,
      minSize: 20000,
      cacheGroups: {
        // ffmpegを別チャンクに分離
        ffmpeg: {
          test: /[\\/]node_modules[\\/]@ffmpeg/,
          name: 'ffmpeg',
          chunks: 'async',
          priority: 10,
        },
        // ビデオプレーヤー関連を別チャンクに分離
        videoPlayers: {
          test: /[\\/]node_modules[\\/](video\.js|shaka-player|hls\.js)/,
          name: 'video-players',
          chunks: 'async',
          priority: 9,
        },
        // ベンダー（その他のライブラリ）
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 1,
        },
      },
    },
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    chunkFormat: false,
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins,
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

// ビルド開始時にログを出力
console.log('🛠️  Webpack building in production mode for Chrome...');

export default config;
