import path from 'node:path';

import webpack from 'webpack';

const config = {
  devServer: {
    compress: true,
    // HMRを有効化
    historyApiFallback: true,
    hot: true,
    port: 3000,
    static: path.resolve(import.meta.dirname, 'dist'), // SPAでのリロード対応
  },
  devtool: 'inline-source-map',
  entry: './src/main.tsx',
  mode: 'development',
  // HMRは開発モードで有効
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
                  corejs: '3.41',
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
        use: {
          loader: 'arraybuffer-loader',
        },
      },
    ],
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    chunkFormat: false,
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
    new webpack.HotModuleReplacementPlugin(), // HMRプラグインを追加
    // {
    //   apply: (compiler) => {
    //     compiler.hooks.done.tap('MetafilePlugin', (stats) => {
    //       const metafilePath = path.resolve(import.meta.dirname, './dist/metafile.json');
    //       const jsonStats = stats.toJson({ all: true });
    //       writeFileSync(metafilePath, JSON.stringify(jsonStats, null, 2));
    //       console.log(`Metafile generated: ${metafilePath}`);
    //     });
    //   },
    // },
  ],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(import.meta.dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
