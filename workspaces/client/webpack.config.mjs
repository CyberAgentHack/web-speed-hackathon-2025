import path from 'node:path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'source-map', // source-mapを使用して元のコードを追跡
  entry: './src/main.tsx',
  mode: 'production', // プロダクションモードでビルド
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
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            unused: true,
          },
          keep_classnames: false,
          keep_fnames: false,
        },
        extractComments: false,
      }),
    ],
    usedExports: true, // 使用されているエクスポートのみを保持
    sideEffects: true, // サイドエフェクトの解析を有効にする
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    chunkFormat: false,
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      statsFilename: 'stats.json', // stats.json ファイルを生成
      analyzerMode: 'static',       // 静的なHTMLレポートを生成
      openAnalyzer: false,         // 自動でブラウザを開かない設定
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 5 }), // チャンク数を最大5に制限
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: 'production' }),
  ],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
  stats: {
    assets: true,  // 出力されるアセットの詳細を表示
    chunks: true,  // チャンクごとの詳細を表示
    modules: true, // モジュールごとの詳細を表示
    reasons: true, // 依存関係の理由を表示
    children: true, // 子チャンクの詳細を表示
    chunkModules: true, // チャンク内のモジュールの詳細を表示
    modulesSpace: 100, // 最大表示モジュール数を制限
  },
};

export default config;
