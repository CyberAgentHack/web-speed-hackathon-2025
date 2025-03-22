import path from 'node:path';

import webpack from 'webpack';

import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: process.env['NODE_ENV'] === 'development' ? 'eval-cheap-module-source-map' : 'source-map',
  entry: './src/main.tsx',
  mode: 'production',
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
                  forceAllTransforms: true,
                  targets: 'defaults',
                  useBuiltIns: 'entry',
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
    chunkFilename: 'chunk-[contenthash].js',
    // filename: '[name].[contenthash].js', // ファイル名にハッシュを追加
    filename: 'main.js', // ファイル名にハッシュを追加
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
  ],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [import.meta.url], // 設定ファイルが変更されたらキャッシュを再構築
    },
  },
  optimization: {
    // モジュールIDを決定的に
    moduleIds: 'deterministic',
    // 使用されているexportsのみをバンドルに含める
    usedExports: true,
    // 未使用のコードを削除
    sideEffects: true,

    // コード分割設定を追加
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          /**
           * @param {{ context: { match: (arg0: RegExp) => any[]; }; }} module
           */
          name(module) {
            // node_modulesのパスからパッケージ名を抽出
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // 問題を起こす可能性のあるパッケージは別チャンクに
            if (['@dhmk', '@ffmpeg', 'video.js', '@videojs'].some((pkg) => packageName.startsWith(pkg))) {
              return `npm.${packageName.replace('@', '')}`;
            }
            // それ以外のベンダーライブラリ
            return 'vendors';
          },
        },
      },
    },

    // コード最小化設定
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 2020,
          },
          compress: {
            ecma: 2020,
            comparisons: false, // 不安定な比較を避ける
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 2020,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        extractComments: false,
      }),
    ],
  },
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
