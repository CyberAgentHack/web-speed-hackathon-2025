import path from 'node:path';

import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

/** @type {import('webpack').Configuration} */
const config = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [import.meta.url],
    },
  },
  devtool: false,
  entry: './src/main.tsx',
  mode: 'production',
  module: {
    rules: [
      {
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: {
          fullySpecified: false,
        },
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx|webp)$/,
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
        test: /\.webp$/,
        type: 'asset/inline',
      },
      {
        generator: {
          filename: 'images/[hash][ext]',
        },
        test: /\.(png|jpg|jpeg|gif|svg)$/,
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
  optimization: {
    chunkIds: 'deterministic',
    concatenateModules: true,
    innerGraph: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,

        terserOptions: {
          compress: {
            dead_code: true,
            drop_console: true,
            drop_debugger: true,
            passes: 2,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            unused: true,
          },

          ecma: 2020,
          format: {
            comments: false,
          },
        },
      }),
    ],
    moduleIds: 'deterministic',
    sideEffects: true,
    usedExports: true,
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    pathinfo: false,
    publicPath: 'auto',
  },
  plugins: [new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' })],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
