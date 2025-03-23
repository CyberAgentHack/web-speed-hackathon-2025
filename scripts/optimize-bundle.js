const fs = require('fs');
const path = require('path');
const terser = require('terser');

async function optimizeBundle() {
  const clientDist = path.join(__dirname, '../workspaces/client/dist');
  const files = fs.readdirSync(clientDist).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(clientDist, file);
    const code = fs.readFileSync(filePath, 'utf8');

    const result = await terser.minify(code, {
      compress: {
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        keep_fnames: false,
        passes: 2
      },
      mangle: true
    });

    fs.writeFileSync(filePath, result.code);
  }
}

optimizeBundle().catch(console.error);