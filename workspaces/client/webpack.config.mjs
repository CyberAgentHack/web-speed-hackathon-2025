import path from 'node:path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'source-map',
  entry:{
    main: { import: './src/main.tsx', dependOn: 'vendor' },
    vendor: ['react', 'react-dom', 'react-router-dom'],
  }, // { app: './src/main.tsx'
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
              ['@babel/preset-env', { corejs: '3.41', forceAllTransforms: true, targets: 'defaults', useBuiltIns: 'entry' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript'],
            ],
          },
        },
      },
      { test: /\.png$/, type: 'asset/inline' },
      { resourceQuery: /raw/, type: 'asset/source' },
      { resourceQuery: /arraybuffer/, type: 'javascript/auto', use: { loader: 'arraybuffer-loader' } },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: { comments: false },
          compress: { drop_console: true, drop_debugger: true, unused: true },
          keep_classnames: false,
          keep_fnames: false,
        },
        extractComments: false,
      }),
    ],
    usedExports: true,
    sideEffects: true,
    splitChunks: {
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          enforce: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/](?!react|react-dom|react-router-dom|@ffmpeg)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          enforce: true,
        },
        ffmpeg: {
          test: /[\\/]node_modules[\\/]@ffmpeg[\\/]/,
          name: 'ffmpeg',
          chunks: 'all',
          enforce: true,
        },
        utils: {
          test: /[\\/]src[\\/]utils[\\/]/,
          name: 'utils',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  output: {
    filename: '[name].js', // エントリーポイントの出力ファイル名を変更
    chunkFilename: '[name]-chunk.js', // チャンクファイルの命名規則を変更
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      statsFilename: 'stats.json',
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 5 }),
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
    assets: true,
    chunks: true,
    modules: true,
    reasons: true,
    children: true,
    chunkModules: true,
    modulesSpace: 100,
  },
};

export default config;
