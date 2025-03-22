import path from 'node:path';
import webpack from 'webpack';

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'inline-source-map',
  entry: './src/main.tsx',
  mode: 'production',
  module: {
    rules: [
      {
        // 対象ファイルから特定の node_modules を除外
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: {
          fullySpecified: false,
        },
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                // TypeScript と JSX を処理する設定（必要に応じて decorators 等も追加）
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic'
                }
              }
            }
          }
        }
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
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api', NODE_ENV: '' }),
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
