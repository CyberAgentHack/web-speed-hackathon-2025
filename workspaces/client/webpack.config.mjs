import path from 'node:path';
import webpack from 'webpack';
// ここを追加
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  entry: './src/main.tsx',
  mode: 'production',
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
                  corejs: false,
                  targets: { chrome: '134' },
                  useBuiltIns: false,
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
      openAnalyzer: true,     // ビルド後に自動でブラウザを開きます
      reportFilename: 'report.html',
    }),
  ],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(
        import.meta.dirname,
        'node_modules',
        '@ffmpeg/core/dist/umd/ffmpeg-core.js'
      ),
      '@ffmpeg/core/wasm$': path.resolve(
        import.meta.dirname,
        'node_modules',
        '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'
      ),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;