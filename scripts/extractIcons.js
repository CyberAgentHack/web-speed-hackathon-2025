const fs = require('fs');
const path = require('path');

// コレクション名と JSON ファイルのパスを指定
const collections = [
  { name: 'bi', icons: ['house-fill'] },
  { name: 'fa-solid', icons: ['sign-out-alt', 'user', 'calendar'] },
  { name: 'line-md', icons: ['loading-twotone-loop'] },
];

// 各コレクションを処理
collections.forEach(({ name, icons }) => {
  const filePath = path.resolve(
    __dirname,
    `../node_modules/.pnpm/@iconify+json@2.2.317/node_modules/@iconify/json/json/${name}.json`
  );
  const outputFilePath = path.resolve(__dirname, `../workspaces/client/src/assets/${name}-selected.json`);

  // JSON ファイルを読み込む
  const collectionData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // 必要なアイコンだけを抽出
  const filteredData = {
    prefix: collectionData.prefix,
    icons: icons.reduce((acc, icon) => {
      if (collectionData.icons[icon]) {
        acc[icon] = collectionData.icons[icon];
      }
      return acc;
    }, {}),
  };

  // 抽出したデータを保存
  fs.writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2));
  console.log(`Filtered ${name} icons saved to ${outputFilePath}`);
});