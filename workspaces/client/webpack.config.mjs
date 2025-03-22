const path = require('path');

module.exports = {
  entry: './src/index.js', // 必要に応じてエントリーポイントを変更してください
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true // React を利用している場合は true に設定
              },
              transform: {
                react: {
                  runtime: 'automatic'
                }
              }
            }
          }
        }
      }
    ]
  },
  // Webpack のファイルシステムキャッシュを有効化
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack_cache')
  }
};
