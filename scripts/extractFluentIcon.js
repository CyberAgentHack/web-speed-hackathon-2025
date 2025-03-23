const fs = require('fs');
const path = require('path');

// fluent.json のパス
const filePath = path.resolve(
  __dirname,
  '../node_modules/.pnpm/@iconify+json@2.2.317/node_modules/@iconify/json/json/fluent.json'
);

// 抽出後のファイルの保存先
const outputFilePath = path.resolve(__dirname, '../workspaces/client/src/assets/fluent-live-24-filled.json');

// 必要なアイコン名
const requiredIcon = 'live-24-filled';

// JSON ファイルを読み込む
const fluentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 必要なアイコンだけを抽出
const filteredData = {
  prefix: fluentData.prefix,
  icons: {
    [requiredIcon]: fluentData.icons[requiredIcon],
  },
};

// 抽出したデータを保存
fs.writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2));
console.log(`Filtered icon saved to ${outputFilePath}`);