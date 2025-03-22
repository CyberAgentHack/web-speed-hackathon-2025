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
    filename: 'main.js',
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: 'auto',
    },
    plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    
    // BundleAnalyzerPlugin を追加
    new BundleAnalyzerPlugin({
    analyzerMode: 'static', // 'server' や 'json' なども指定可能
    openAnalyzer: true, // ビルド後に自動でブラウザを開きます
    reportFilename: 'report.html',
    }),
    ],

  // @ffmpeg/core の alias を削除して、初期バンドルから外しやすくする
  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;