/* eslint-disable */
import path from 'node:path';
import os from 'node:os';

import webpack from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

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
                    targets: 'last 2 Chrome versions',
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
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  //   minimizer: [new CssMinimizerPlugin()],
  // },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  output: {
    filename: '[name].[contenthash].js', // エントリーポイントのファイル名
    chunkFilename: 'chunks/[name].[contenthash].js', // 動的に生成されるチャンクのファイル名
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    new MiniCssExtractPlugin(),
    new WebpackAssetsManifest({
      output: 'manifest.json', // 出力されるmanifestファイル
      publicPath: true, // ファイルパスをpublicPathに基づいて解決
    }),
    // new webpackBundleAnalyzer.BundleAnalyzerPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
