import path from 'node:path';

// import CompressionPlugin from 'compression-webpack-plugin';
// import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
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
                  // targets: '> 0.25%, not dead',
                  // useBuiltIns: 'usage', // 必要なPolyfillだけを読み込む
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
        use: { loader: 'arraybuffer-loader' },
      },
    ],
  },

  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'all',
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: 'all',
    },
  },
  output: {
    // ハッシュ付きでキャッシュ防止
    chunkFilename: 'chunk-[contenthash].js',
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }), new BundleAnalyzerPlugin()],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
