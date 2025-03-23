import path from 'node:path';

import UnoCSS from '@unocss/postcss';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'source-map',
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
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env', UnoCSS()],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    realContentHash: true,
    splitChunks: {
      cacheGroups: {
        ffmpeg: {
          chunks: 'all',
          name: 'ffmpeg',
          priority: 20,
          test: /[\\/]node_modules[\\/]@ffmpeg/,
        },
        iconify: {
          chunks: 'all',
          name: 'iconify',
          priority: 20,
          test: /[\\/]node_modules[\\/]@iconify/,
        },
        vendor: {
          chunks: 'all',
          name: 'vendors',
          priority: 10,
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: 'all',
    },
    usedExports: true,
  },
  output: {
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: '/public/',
  },
  plugins: [
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    ...(process.env['ANALYZE'] ? [new BundleAnalyzerPlugin()] : []),
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
