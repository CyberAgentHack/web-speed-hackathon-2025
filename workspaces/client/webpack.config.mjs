import path from 'node:path';

import webpack from 'webpack';

import TerserPlugin from 'terser-webpack-plugin';

// import CompressionPlugin from 'compression-webpack-plugin';

// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

/** @type {import('webpack').Configuration} */
const config = {
  devtool: process.env['NODE_ENV'] === 'development' ? 'eval-cheap-module-source-map' : false,
  entry: './src/main.tsx',
  mode: process.env['NODE_ENV'] === 'development' ? 'development' : 'production',
  cache: {
    type: 'filesystem', // ファイルシステムキャッシュを使用
    buildDependencies: {
      config: [__filename], // webpack.config.mjsファイルの変更時にキャッシュを再構築
    },
  },
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
            cacheDirectory: true, // Babelのキャッシュを有効化
            cacheCompression: false, // キャッシュ圧縮を無効化して処理を高速化
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
      // {
      //   exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
      //   resolve: {
      //     fullySpecified: false,
      //   },
      //   test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         [
      //           '@babel/preset-env',
      //           {
      //             corejs: '3.41',
      //             // forceAllTransforms: true, // この行を削除またはコメントアウト
      //             targets: 'defaults',
      //             useBuiltIns: 'usage', // entryからusageに変更
      //           },
      //         ],
      //         ['@babel/preset-react', { runtime: 'automatic' }],
      //         ['@babel/preset-typescript'],
      //       ],
      //       cacheDirectory: true, // この行を追加
      //     },
      //   },
      // },
      // {
      //   test: /\.png$/,
      //   type: 'asset', // asset/inlineからassetに変更
      //   parser: {
      //     dataUrlCondition: {
      //       maxSize: 4 * 1024, // 4KB以下の画像のみインライン化
      //     },
      //   },
      // },
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, 'css-loader'],
      // },
    ],
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    chunkFormat: false,
    filename: '[name].[contenthash].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }), //del
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    // new CompressionPlugin({
    //   algorithm: 'gzip',
    //   test: /\.(js|css|html|svg|jpeg)$/,
    // }),
    // new MiniCssExtractPlugin({
    //   filename: '[name].[contenthash].css',
    // }),
    // new BundleAnalyzerPlugin(),
  ],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
    // // 既存のエイリアスやextensionsはそのまま
    symlinks: false, // シンボリックリンク解決をスキップ
    cacheWithContext: false,
    modules: ['node_modules', path.resolve(import.meta.dirname, 'node_modules')],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      // new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    usedExports: true,
    sideEffects: true,
  },
};

export default config;
