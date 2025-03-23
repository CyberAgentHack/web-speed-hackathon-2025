import path from 'node:path';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: process.env['NODE_ENV'] === 'production' ? false : 'cheap-module-source-map',
  entry: './src/main.tsx',
  mode: process.env['NODE_ENV'] === 'production' ? 'production' : 'development',
  optimization: {
    usedExports: true,
    sideEffects: true,
    minimize: process.env['NODE_ENV'] === 'production',
    moduleIds: 'deterministic',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 2017,
          },
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2,
            drop_console: process.env['NODE_ENV'] === 'production',
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
      }),
    ],
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
            cacheDirectory: true,
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
    chunkFormat: false,
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' })],
  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
