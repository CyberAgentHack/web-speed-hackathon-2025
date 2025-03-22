const fs = require('fs');
const path = require('path');

// material-symbols.json のパス
const filePath = path.resolve(
  __dirname,
  '../node_modules/.pnpm/@iconify+json@2.2.317/node_modules/@iconify/json/json/material-symbols.json'
);

// 抽出後のファイルの保存先
const outputFilePath = path.resolve(__dirname, '../workspaces/client/src/assets/material-symbols-selected.json');

// 使用しているアイコン名をリストアップ
const requiredIcons = [
  'play-arrow-rounded',
  'warning-outline-rounded',
  'error-outline',
  'pause-rounded',
  'volume-off-rounded',
  'volume-up-rounded',
];

// JSON ファイルを読み込む
const materialSymbolsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 必要なアイコンだけを抽出
const filteredData = {
  prefix: materialSymbolsData.prefix,
  icons: requiredIcons.reduce((acc, icon) => {
    if (materialSymbolsData.icons[icon]) {
      acc[icon] = materialSymbolsData.icons[icon];
    }
    return acc;
  }, {}),
};

// 抽出したデータを保存
fs.writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2));
console.log(`Filtered material-symbols saved to ${outputFilePath}`);