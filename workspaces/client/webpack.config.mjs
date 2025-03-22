import path from 'node:path';

import webpack from 'webpack';

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'production',
  devtool: 'source-map',

  // cache: { type: 'filesystem' },

  entry: './src/main.tsx',

  output: {
    path: path.resolve(import.meta.dirname, './dist'),
    filename: 'main.js',
    chunkFilename: 'chunk-[contenthash].js',
    publicPath: 'auto',
    chunkFormat: false,
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: { fullySpecified: false },
        use: {
          loader: 'babel-loader',
          options: {
            // cacheDirectory: true,
            // cacheCompression: false,
            presets: [
              ['@babel/preset-env', { forceAllTransforms: true, targets: { chrome: '134' }, useBuiltIns: false }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript'],
            ],
          },
        },
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
        parser: { dataUrlCondition: { maxSize: 1024 } },
      },
      { resourceQuery: /raw/, type: 'asset/source' },
      { resourceQuery: /arraybuffer/, type: 'javascript/auto', use: 'arraybuffer-loader' },
    ],
  },

  optimization: {
    minimize: true,
    moduleIds: 'deterministic',
    // runtimeChunk: 'single',
    splitChunks: false,
  },

  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    // new webpack.ids.HashedModuleIdsPlugin(),
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
