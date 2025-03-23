import path from 'node:path';

import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import UnoCSS from 'unocss/webpack';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'inline-source-map',
  entry: './src/main.tsx',
  mode: 'none',
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
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.webp$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
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
    chunkFormat: false,
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true,
      reportFilename: 'bundle-report.html',
    }),
    // Lodashを使用しないようにする設定
    new webpack.IgnorePlugin({
      resourceRegExp: /^lodash$/,
    }),
    // iconify/jsonの大きなJSONファイルを使用しないようにする設定
    new webpack.IgnorePlugin({
      resourceRegExp: /^@iconify\/json\/json\//,
    }),
    UnoCSS(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        ffmpeg: {
          test: /[\\/]node_modules[\\/]@ffmpeg/,
          name: 'ffmpeg',
          priority: 10,
          chunks: 'async',
        },
        iconify: {
          test: /[\\/]node_modules[\\/]@iconify-icons/,
          name: 'iconify',
          priority: 9,
          chunks: 'async',
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
