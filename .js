import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production', // 本番モードを明示
  entry: './src/index.tsx', // エントリーポイント
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',  // キャッシュ対策として contenthash を付与
    clean: true, // ビルド時に dist フォルダをクリーン
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.mjs'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      // 画像、フォントなどのアセット用ルールを必要に応じて追加
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',  // 共有コードを自動的に切り出す
      // minSize など細かい閾値を調整できる
    },
    runtimeChunk: 'single', // ランタイムを別ファイルに分割し、キャッシュしやすくする
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // title, metaなどを必要に応じて設定
    }),
    // ほか、MiniCssExtractPlugin などスタイル関連プラグインを利用していれば追加
  ],
};
