/* eslint-disable */

const Module = require('module');
const fs = require('fs').promises;
cache = new Map()

Module._extensions['.png'] = async function (module, fn) {
  if (cache.has(fn)) {
    module._compile(`module.exports=${JSON.stringify(cache.get(fn))}`, fn);
    return;
  }

  try {
    const data = await fs.readFile(fn); // 非同期化
    const base64 = `data:image/png;base64,${data.toString('base64')}`;
    
    cache.set(fn, base64); // キャッシュを使用
    module._compile(`module.exports=${JSON.stringify(base64)}`, fn);
  } catch (error) {
    throw new Error(`Error loading PNG file: ${fn} - ${error.message}`);
  }
};