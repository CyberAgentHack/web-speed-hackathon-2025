import path from 'node:path';

import { EsbuildPlugin } from 'esbuild-loader';
import webpack from 'webpack';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: process.env['NODE_ENV'] === 'production' ? false : 'source-map',

  entry: {
    main: './src/main.tsx',
  },

  mode: 'production',

  module: {
    rules: [
      {
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            sourcemap: false,
            target: 'esnext',
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

  optimization: {
    // コードの最適化 (圧縮) はそのまま行う
    minimize: true,
    minimizer: [
      new EsbuildPlugin({
        css: true,
        target: 'esnext',
      }),
    ],

    // ランタイムチャンクの分割もオフ (必要に応じて)
    runtimeChunk: false,
    // チャンク分割をオフ
    splitChunks: false,
  },

  output: {
    // 複数エントリだがチャンクを分割しない
    filename: '[name].js',
    path: path.resolve(import.meta.dirname, 'dist'),
    publicPath: 'auto',
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      API_BASE_URL: '/api',
      NODE_ENV: 'production',
    }),
  ],

  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(
        import.meta.dirname,
        'node_modules',
        '@ffmpeg/core/dist/umd/ffmpeg-core.js'
      ),
      '@ffmpeg/core/wasm$': path.resolve(
        import.meta.dirname,
        'node_modules',
        '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'
      ),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
