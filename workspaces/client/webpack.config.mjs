import path from 'node:path';

import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('webpack').Configuration} */
const config = {
  cache: {
    buildDependencies: {
      config: [__filename],
    },
    type: 'filesystem',
  },
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
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: '3.41',
                  forceAllTransforms: true,
                  targets: 'defaults',
                  useBuiltIns: 'usage',
                },
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript'],
            ],
          },
        },
      },
      {
        generator: {
          filename: 'images/[hash][ext][query]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4KB
          },
        },
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
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
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
          },
        },
      }),
    ],
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        common: {
          minChunks: 2,
          name: 'common',
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `vendor.${packageName.replace('@', '')}`;
          },
          priority: 10,
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
    },
  },
  output: {
    chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].chunk.js',
    clean: true,
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      API_BASE_URL: '/api',
      NODE_ENV: isProduction ? 'production' : 'development',
    }),
    new webpack.ids.DeterministicChunkIdsPlugin(),
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
