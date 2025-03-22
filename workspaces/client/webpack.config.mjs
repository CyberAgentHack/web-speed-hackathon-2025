import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('webpack').Configuration} */
const config = {
  // 本番ビルド向け設定
  mode: 'production',
  devtool: false, // ソースマップ不要なら false。デバッグ用に 'source-map' にしても可
  
  entry: './src/main.tsx',

  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { chrome: '134' },
                  useBuiltIns: false,
                  forceAllTransforms: false,
                  corejs: false,
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

  optimization: {
    // コード分割 (splitChunks) を有効
    splitChunks: {
      chunks: 'all',
    },
  },

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'auto',
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      API_BASE_URL: '/api',
      NODE_ENV: 'production',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],

  resolve: {
    alias: {
      // 以下のように「@ffmpeg/core」を dist/umd ディレクトリに丸ごと差し替える
      '@ffmpeg/core': path.resolve(
        __dirname,
        'node_modules',
        '@ffmpeg/core/dist/umd'
      ),
      // ↑ こうしておくと、JS と同一ディレクトリの wasm を自動取得しやすくなる
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;