import path from 'node:path';

import webpack from 'webpack';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';

const isProduction = process.env['NODE_ENV'] === 'production';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  entry: './src/main.tsx',
  mode: isProduction ? 'production' : 'development',
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
    chunkFilename: isProduction ? 'chunk-[contenthash].js' : 'chunk-[name].js',
    chunkFormat: false,
    filename: isProduction ? '[name].[contenthash].js' : 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  optimization: {
    minimize: isProduction,
    splitChunks: isProduction ? {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        player: {
          test: /[\\/]node_modules[\\/](hls\.js|shaka-player|video\.js)[\\/]/,
          name: 'player-vendors',
          chunks: 'all',
          priority: 20
        }
      }
    } : false,
  },
  plugins: [
    new webpack.EnvironmentPlugin({ 
      API_BASE_URL: '/api', 
      NODE_ENV: isProduction ? 'production' : 'development' 
    }),
    ...(isProduction ? [
      // プロダクション環境のみのプラグイン
      process.env['ANALYZE'] && new BundleAnalyzerPlugin.BundleAnalyzerPlugin()
    ] : [
      // 開発環境のみのプラグイン
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
    ]).filter(Boolean),
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
