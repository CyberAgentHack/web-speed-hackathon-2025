import path from 'node:path';

import webpack from 'webpack';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const plugins = [
  // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
  // new BundleAnalyzerPlugin(),
];

// test

const ffmpegConfig = {
  '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
  '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
};

/** @type {import('webpack').Configuration} */
const config = {
  devtool: false,
  entry: './src/main.tsx',
  externals: {
    ...ffmpegConfig,
  },
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
            cacheDirectory: true,
            presets: [
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
  plugins,
  resolve: {
    alias: {
      ...ffmpegConfig,
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
