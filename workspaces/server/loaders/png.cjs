/* eslint-disable */

const Module = require('module');
const fs = require('fs');

Module._extensions['.png'] = function (module, fn) {
  const base64 = fs.readFileSync(fn).toString('base64');
  module._compile('module.exports="data:image/png;base64,' + base64 + '"', fn);
};
