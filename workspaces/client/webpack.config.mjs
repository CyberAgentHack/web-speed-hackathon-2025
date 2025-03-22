import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('webpack').Configuration} */
const config = {
  // 本番ビルド向け設定
  mode: 'production',
  devtool: false,  // ソースマップ不要なら false。デバッグ用に 'source-map' にしてもよい。
  
  entry: './src/main.tsx',
  
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // 使用しているプリセット類
            presets: [
              [
                '@babel/preset-env',
                {
                  // ここは実際にサポートしたい環境に合せて設定
                  targets: {
                    chrome: '134',
                    },
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
  
  // ---- ここが重要 ----
  optimization: {
    // コード分割 (splitChunks) を有効にして、キャッシュや読み込みを最適化
    splitChunks: {
      chunks: 'all',  // すべてのチャンクから分割
      // さらに細かい制御が必要なら cacheGroups や minSize, maxSize を調整
      // 例:
      // cacheGroups: {
      //   vendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: 'vendors',
      //     chunks: 'all',
      //   },
      // },
    },
    // もし Tree Shaking/Minification をより最適化する場合は、minimizer に TerserPlugin 等を明示
    // minimizer: [new TerserPlugin({ /* オプション */ })],
  },
  // --------------------

  output: {
    // バンドルやチャンクの命名ルールを指定
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'auto',
  },

  plugins: [
    // LimitChunkCountPlugin は削除して、デフォルトのコード分割に任せる
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }), ← 削除

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
      '@ffmpeg/core$': path.resolve(
        __dirname,
        'node_modules',
        '@ffmpeg/core/dist/umd/ffmpeg-core.js'
      ),
      '@ffmpeg/core/wasm$': path.resolve(
        __dirname,
        'node_modules',
        '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'
      ),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;