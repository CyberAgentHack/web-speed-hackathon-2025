import path from 'node:path';

import webpack from 'webpack';

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'production',
  devtool: 'source-map',

  // cache: { type: 'filesystem' },

  entry: './src/main.tsx',

  output: {
    path: path.resolve(import.meta.dirname, './dist'),
    filename: 'main.js',
    chunkFilename: 'chunk-[contenthash].js',
    publicPath: 'auto',
    chunkFormat: false,
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: { fullySpecified: false },
        use: {
          loader: 'babel-loader',
          options: {
            // cacheDirectory: true,
            // cacheCompression: false,
            presets: [
              ['@babel/preset-env', { forceAllTransforms: true, targets: { chrome: '134' }, useBuiltIns: false }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript'],
            ],
          },
        },
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
        parser: { dataUrlCondition: { maxSize: 1024 } },
      },
      { resourceQuery: /raw/, type: 'asset/source' },
      { resourceQuery: /arraybuffer/, type: 'javascript/auto', use: 'arraybuffer-loader' },
    ],
  },

  optimization: {
    minimize: true,
    moduleIds: 'deterministic',
    // runtimeChunk: 'single',
    splitChunks: false,
    // minimizer: [
    //   new TerserPlugin({
    //     // 並列処理の実行を有効化
    //     // 同時に実行するを数値を設定
    //     parallel: 4,
    //     // swcを有効化
    //     // minify: TerserPlugin.swcMinify,
    //     // Minify Optionsを設定
    //     terserOptions: {
    //       // 最適化
    //       compress: {
    //         ecma: 5,
    //         comparisons: false,
    //         inline: 2,
    //       },
    //       // 変数名を短く
    //       mangle: {
    //         safari10: true,
    //       },
    //     },
    //   }),
    // ],
  },

  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    // new webpack.ids.HashedModuleIdsPlugin(),
  ],

  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
