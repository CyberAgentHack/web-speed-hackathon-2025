import path from 'node:path';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'source-map',
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
            // キャッシュを有効化
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: '3.41',
                  // 必要な変換のみ行うように変更
                  forceAllTransforms: false,
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
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8KB以下はインライン化
          },
        },
        test: /\.png$/,
        // 小さい画像はインライン化、大きい画像は個別ファイルとして出力
        type: 'asset',
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
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: 'all',
      maxInitialRequests: 6,
    },
    usedExports: true,
  },
  output: {
    chunkFilename: 'chunk-[name].[contenthash].js',
    chunkFormat: 'array-push',
    clean: true,
    filename: '[name].[contenthash].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 250 * 1024, // 250KB
    maxEntrypointSize: 500 * 1024, // 500KB
  },
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
    symlinks: false,
  },
  stats: {
    assets: true,
    chunks: false,
    modules: false,
  },
};

export default config;
