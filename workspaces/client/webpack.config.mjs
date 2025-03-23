import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/main.tsx',
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
    filename: 'main.js',
    chunkFilename: 'chunk-[contenthash].js',
    chunkFormat: false,
    path: path.resolve(fileURLToPath(import.meta.url), '../dist'),
    publicPath: 'auto',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
    minimize: true,
  },
  plugins: [
    // LimitChunkCountPluginを削除してコード分割を有効化
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: process.env.NODE_ENV || 'production' }),
  ],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(fileURLToPath(import.meta.url), '../node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(fileURLToPath(import.meta.url), '../node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;

