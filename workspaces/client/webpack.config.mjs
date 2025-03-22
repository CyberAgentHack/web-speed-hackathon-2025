import path from 'node:path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'inline-source-map',
  entry: './src/main.tsx',
  mode: 'production',

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
  },

  module: {
    rules: [
      {
        // mjs, cjs, mts, cts を除外し、js / jsx / ts / tsx のみ対象
        test: /\.(?:js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
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
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(import.meta.dirname, 'dist'),
    chunkFormat: false,
    publicPath: 'auto',
  },

  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 30 }),
    new webpack.EnvironmentPlugin({
      API_BASE_URL: '/api',
      NODE_ENV: 'production',
    }),
    new BundleAnalyzerPlugin(),
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
    // mjs, cjs, mts, cts を除外
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
  },
};

export default config;
