import path from 'node:path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  entry: './src/main.tsx',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        exclude: [
          /node_modules\/video\.js/, 
          /node_modules\/@videojs/,
          /node_modules\/shaka-player/,
          /node_modules\/hls\.js/,
          /node_modules\/react-dom/
        ],
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
            compact: false
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
    chunkFilename: '[name].[contenthash].js',
    filename: 'main.[contenthash].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: '/public/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 5,
      cacheGroups: {
        iconifyJson: {
          test: /[\\/]node_modules[\\/]@iconify[\\/]json/,
          name: 'iconify-json',
          chunks: 'async',
          priority: 20,
        },
        videoPlayer: {
          test: /[\\/]node_modules[\\/](video\.js|hls\.js|shaka-player)/,
          name: 'video-player',
          chunks: 'async',
          priority: 15,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
          priority: 10,
        },
      },
    },
  },
  externals: {
    '@ffmpeg/ffmpeg': 'FFmpegWASM',
    '@ffmpeg/core': 'FFmpegCore',
    '@ffmpeg/util': 'FFmpegUtil'
  },
  plugins: [
    new webpack.EnvironmentPlugin({ 
      API_BASE_URL: '/api', 
      NODE_ENV: process.env.NODE_ENV || 'development' 
    }),
    process.env.ANALYZE === 'true' && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
