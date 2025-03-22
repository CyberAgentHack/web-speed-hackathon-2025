/* eslint-disable */

const Module = require('module');
const path = require('path');

Module._extensions['.png'] = function (module, fn) {
  const projectRoot = path.resolve(__dirname, '../..');
  const relativePath = path.relative(projectRoot, fn);

  const normalizedPath = relativePath.replace(/\\/g, '/');

  module._compile(`module.exports="/static/${normalizedPath}"`, fn);
};

Module._extensions['.webp'] = function (module, fn) {
  const projectRoot = path.resolve(__dirname, '../..');
  const relativePath = path.relative(projectRoot, fn);
  const normalizedPath = relativePath.replace(/\\/g, '/');
  module._compile(`module.exports="/static/${normalizedPath}"`, fn);
};
