import path from 'node:path';

import { rspack } from '@rspack/core';

/** @type {import('webpack').Configuration} */
const config = {
  // devtool: 'inline-source-map',
  devtool: false,
  entry: './src/main.tsx',
  mode: 'production',
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: {
          enforceExtension: false,
        },
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        // exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            target: 'es2020',
            parser: {
              syntax: 'typescript',
              jsx: true,
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.tsx$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              target: 'es2020',
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
            },
          },
        },
        type: 'javascript/auto',
      },
      // {
      //   exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
      //   resolve: {
      //     fullySpecified: false,
      //   },
      //   test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         [
      //           '@babel/preset-env',
      //           {
      //             corejs: '3.41',
      //             forceAllTransforms: true,
      //             targets: 'defaults',
      //             useBuiltIns: 'entry',
      //           },
      //         ],
      //         ['@babel/preset-react', { runtime: 'automatic' }],
      //         ['@babel/preset-typescript', {}],
      //       ],
      //     },
      //   },
      // },
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
        test: /\.css$/i,
        type: 'css/auto',
        use: ['postcss-loader'],
        include: [path.resolve(import.meta.dirname, 'src')],
      },
    ],
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    // chunkFormat: false,
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    // @ts-ignore ignore
    new rspack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: 'production' }),
  ],
  resolve: {
    // alias: {
    //   '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
    //   '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    // },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
