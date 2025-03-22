export const getThumbnailUrl = (url: string, size: "small" | "big" = "small") => {
  // input /public/images/1.jpeg
  // output /public/images/${size}/1.avif
  const fileName = url.split('/').pop() || '';
  const baseName = fileName.split('.')[0];
  return url.replace(fileName, `${size}/${baseName}.avif`);
}
