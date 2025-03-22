import path from 'node:path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';


/** @type {import('webpack').Configuration} */
const config = {
  entry: './src/main.tsx',
  mode: 'production',

  // コード分割 (SplitChunks) を有効化
  optimization: {
    splitChunks: {
      // 'all' にすると、node_modules などの共通コードも自動的に別チャンク化される
      chunks: 'all',
    },
  },

  module: {
    rules: [
      {
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: {
          fullySpecified: false,
        },
        test: /\.(js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // 必要に応じて調整
                  corejs: false,
                  targets: { chrome: '134' },
                  useBuiltIns: false,
                },
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
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
    // メインバンドル
    filename: 'main.[contenthash].js',
    // 分割チャンク側
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: 'auto',
  },

  plugins: [
    // LimitChunkCountPlugin を削除してコード分割を有効化
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }), ← 削除

    // 環境変数プラグイン (必要に応じて修正)
    new webpack.EnvironmentPlugin({
      API_BASE_URL: '/api',
      NODE_ENV: '',
    }),

    // バンドルアナライザプラグイン (サイズ把握用)
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true,
      reportFilename: 'report.html',
    }),
  ],

  // @ffmpeg/core の alias を削除して、初期バンドルから外しやすくする
  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;