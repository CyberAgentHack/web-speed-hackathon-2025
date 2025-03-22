import path from 'node:path';
import webpack from 'webpack';

export default {
  entry: './src/main.tsx',
  mode: 'production',
  devtool: false,
  output: {
    path: path.resolve(import.meta.dirname, './dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: 'auto',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|cjs|jsx|ts|tsx)$/,
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: {
          fullySpecified: false
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: '3.41',
                  useBuiltIns: 'entry',
                  targets: 'defaults'
                }
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript']
            ]
          }
        }
      },
      // 画像・フォントなどのアセット処理
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: 'single'
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      API_BASE_URL: '/api',
      NODE_ENV: 'production'
    })
  ],
  resolve: {
    alias: {
      // FFmpegなどのaliasがある場合
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx']
  }
};
