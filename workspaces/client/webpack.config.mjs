import path from 'node:path';

import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'; // 追加

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
        test: /\.avif$/, // 追加: AVIF ファイルの処理
        type: 'asset/resource',
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
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 10000
    }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    new BundleAnalyzerPlugin(), // 追加
  ],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
  target: 'browserslist', // 追加
  optimization: { // 追加: 最適化オプション
    minimize: true,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 20000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          // @ts-ignore
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `vendor.${packageName.replace('@', '')}`;
          },
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single',
    usedExports: true,
    moduleIds: 'deterministic',
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

export default config;
