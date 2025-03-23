import path from 'node:path';

// import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  // 本番モードで最適化
  devtool: false, // ソースマップを無効化で軽量化
  entry: './src/main.tsx',
  mode: 'production',

  module: {
    rules: [
      {
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: { fullySpecified: false },
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: '3.41',
                  // 最新版のみ対象
                  forceAllTransforms: false,
                  targets: 'last 1 version',
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
        use: { loader: 'arraybuffer-loader' },
      },
    ],
  },

  optimization: {
    minimize: true,
    // 未使用コードの削除
    minimizer: [
      new TerserPlugin({
        // swcを有効化
        // 並列処理の実行を有効化
        // 同時に実行するを数値を設定
        parallel: 4,
        // Minify Optionsを設定
        terserOptions: {
          // 最適化
          compress: {
            comparisons: false,
            ecma: 5,
            inline: 2,
          },
          // 変数名を短く
          mangle: {
            safari10: true,
          },
        },
      }),
    ],
    usedExports: true,
  },

  output: {
    // ハッシュ付きでキャッシュ防止
    chunkFilename: 'chunk-[contenthash].js',
    chunkFormat: false,
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },

  plugins: [
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: 'production' }),
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      // '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
