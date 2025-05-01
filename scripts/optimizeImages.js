// filepath: /scripts/optimizeImages.js
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');

(async () => {
  const files = await imagemin(['./src/assets/images/*.{jpg,png}'], {
    destination: './src/assets/images/optimized',
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] }),
      imageminWebp({ quality: 75 }),
    ],
  });

  console.log('Images optimized:', files);
})();