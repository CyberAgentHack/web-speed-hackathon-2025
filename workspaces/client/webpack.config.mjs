import path from 'node:path';

import CompressionPlugin from 'compression-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

/** @typedef {import('webpack').Compiler} Compiler */
/** @typedef {import('webpack').WebpackPluginInstance} WebpackPluginInstance */

/** @type {import('webpack').Configuration} */
const config = {
  devtool: process.env['NODE_ENV'] === 'production' ? false : 'inline-source-map',
  entry: {
    main: {
      import: ['./src/main.tsx'],
      filename: '[name].[contenthash].js',
    },
  },
  // mode: process.env['NODE_ENV'] === 'production' ? 'production' : 'development',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        resolve: {
          fullySpecified: false,
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  useBuiltIns: false,
                  targets: {
                    browsers: ['last 2 versions', 'not dead'],
                  },
                },
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript'],
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4KB
          },
        },
        generator: {
          filename: 'images/[name].[contenthash][ext]',
        },
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
    chunkFilename: '[name].[contenthash].js',
    filename: '[name].[contenthash].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 20,
      maxAsyncRequests: 20,
      minSize: 20000,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|@remix-run)[\\/]/,
          name: 'vendor.react',
          priority: 20,
          reuseExistingChunk: true,
        },
        hls: {
          test: /[\\/]node_modules[\\/](hls\.js|@ffmpeg)[\\/]/,
          name: 'vendor.hls',
          priority: 18,
          reuseExistingChunk: true,
        },
        sql: {
          test: /[\\/]node_modules[\\/](sql\.js|@jlongster\/sql\.js|better-sqlite3|sqlite3)[\\/]/,
          name: 'vendor.sql',
          priority: 17,
          reuseExistingChunk: true,
        },
        ui: {
          test: /[\\/]node_modules[\\/](@radix-ui|@floating-ui|@headlessui|@heroicons)[\\/]/,
          name: 'vendor.ui',
          priority: 15,
          reuseExistingChunk: true,
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          /** @param {object & { context?: string }} module */
          name(module) {
            if (!module?.context) return 'vendor';
            const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            const packageName = match?.[1]?.replace('@', '') ?? 'vendor';
            return `vendor.${packageName.split('/')[0]}`;
          },
          priority: 10,
          reuseExistingChunk: true,
          minSize: 10000,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    moduleIds: 'deterministic',
  },
  plugins: [
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: process.env['NODE_ENV'] || 'development' }),
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
      publicPath: '/public/',
      /** @param {Record<string, string>} seed */
      /** @param {Array<{name: string, path: string}>} files */
      generate: (seed, files) => {
        const manifestFiles = files.reduce((manifest, file) => {
          if (file && typeof file === 'object' && 'name' in file && 'path' in file) {
            manifest[file.name] = file.path;
          }
          return manifest;
        }, /** @type {Record<string, string>} */(seed || {}));
        return manifestFiles;
      },
    }),
    new CompressionPlugin({
      test: /\.(js|css|html|svg)$/,
      algorithm: 'gzip',
      threshold: 10240, // 10KB以上のファイルのみ圧縮
      minRatio: 0.8,
    }),
    process.env['ANALYZE'] === 'true' && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../bundle-analysis.html',
      openAnalyzer: false,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
