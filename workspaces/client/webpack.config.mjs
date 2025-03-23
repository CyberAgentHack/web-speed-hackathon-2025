import path from 'node:path';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import UnoCSS from '@unocss/webpack';

/** @type {import('webpack').Configuration} */
const config = {
  //devtool: process.env['NODE_ENV'] === 'production' ? 'source-map' : 'eval',
  devtool: false,
  entry: {
    main: './src/main.tsx'
  },
  mode: process.env['NODE_ENV'] === 'production' ? 'production' : 'development',
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
  optimization: {
    minimize: process.env['NODE_ENV'] === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env['NODE_ENV'] === 'production',
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    usedExports: true,
    sideEffects: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 最後のフォールバックとしてのvendors
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
        },
        // Reactとその関連ライブラリ
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|react-use|react-final-form|react-flip-toolkit)[\\/]/,
          priority: 20,
          name: 'react-libs',
          enforce: true,
        },
        // core-jsとBabel関連
        corejs: {
          test: /[\\/]node_modules[\\/](core-js|@babel\/runtime)[\\/]/,
          priority: 20,
          name: 'core-js',
          enforce: true,
        },
        // データ検証・スキーマライブラリ
        validation: {
          test: /[\\/]node_modules[\\/](zod|valibot|@standard-schema)[\\/]/,
          priority: 15,
          name: 'validation-libs',
          enforce: true,
        },
        // 汎用ユーティリティライブラリ
        utils: {
          test: /[\\/]node_modules[\\/](lodash|luxon|immer|invariant|final-form|zustand|classnames)[\\/]/,
          priority: 15,
          name: 'utils',
          enforce: true,
        },
        // Iconifyのファイルを個別のチャンクに分割
        iconify: {
          test: /[\\/]node_modules[\\/]@iconify[\\/]json[\\/]json[\\/]/,
          priority: 10,
          name(/** @type {{ context: string }} */ module) {
            // iconify/json/json/xxxx.jsonからxxxxを抽出
            const match = module.context.match(/@iconify\/json\/json\/([^.]+)\.json/);
            return match ? `iconify-${match[1]}` : 'iconify';
          },
          enforce: true,
        },
        // FFMPEGのファイルを個別のチャンクに分割
        ffmpeg: {
          test: /[\\/]node_modules[\\/]@ffmpeg[\\/]/,
          priority: 10,
          name(/** @type {{ context: string }} */ module) {
            // @ffmpeg/xxx からxxxを抽出
            const match = module.context.match(/@ffmpeg\/([-\w]+)/);
            return match ? `ffmpeg-${match[1]}` : 'ffmpeg';
          },
          enforce: true,
        },
        // すべてのビデオ関連ライブラリとcreate_playerを1つのチャンクにまとめる
        videoPlayers: {
          test: /** @type {any} */ (module) => {
            // create_player.tsファイルを含める
            if (module.resource && typeof module.resource === 'string' && /create_player\.ts$/.test(module.resource)) {
              return true;
            }
            // video.js、@videojs、hls.js、shaka-playerを含める
            return /[\\/]node_modules[\\/](video\.js|@videojs|hls\.js|shaka-player)[\\/]/.test(
              (typeof module.resource === 'string' ? module.resource : '')
            );
          },
          priority: 10,
          name: 'video-players',
          enforce: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime'
    },
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    filename: '[name].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api' }),
    UnoCSS(),
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
