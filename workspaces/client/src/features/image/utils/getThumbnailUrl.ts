export const getThumbnailUrl = (url: string, size: "small" | "big" = "small") => {
  // input /public/images/small/1.avif
  // output /public/images/${size}/1.avif
  return url.replace(/\/images\/(small|big)\//, `/images/${size}/`);
}
