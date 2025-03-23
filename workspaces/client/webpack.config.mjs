import path from 'node:path';
import os from 'node:os';

import webpack from 'webpack';
// import webpackBundleAnalyzer from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'inline-source-map',
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
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    corejs: '3.41',
                    forceAllTransforms: true,
                    targets: '> 0.25%, not dead',
                    useBuiltIns: 'entry',
                  },
                ],
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-typescript'],
              ],
            },
          },
        ],
      },
      {
        test: /\.png$/,
        type: 'asset/inline',
      },
      {
        test: /\.json$/,
        include: path.resolve(import.meta.dirname, './assets/icons'),
        type: 'json',
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
  // TODO: Add splitChunks optimization
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     minSize: 20000,
  //     maxSize: 500000,
  //   },
  // },
  output: {
    chunkFilename: '[name]-[contenthash].js',
    chunkFormat: false,
    filename: '[name].[contenthash].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    // new webpackBundleAnalyzer.BundleAnalyzerPlugin(),
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
