// import path from 'path';
// import { fileURLToPath } from 'url';
// import HtmlWebpackPlugin from 'html-webpack-plugin';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default {
//   mode: 'production', 
//   entry: './src/index.tsx', 
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: '[name].[contenthash].js',  // キャッシュ対策として contenthash を付与
//     clean: true, // ビルド時に dist フォルダをクリーン
//   },
//   resolve: {
//     extensions: ['.js', '.ts', '.tsx', '.mjs'],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.[jt]sx?$/,
//         use: 'babel-loader',
//         exclude: /node_modules/,
//       },
     
//     ],
//   },
//   optimization: {
//     splitChunks: {
//       chunks: 'all', 
      
//     },
//     runtimeChunk: 'single', 
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './public/index.html',
//     }),
//   ],
// };
