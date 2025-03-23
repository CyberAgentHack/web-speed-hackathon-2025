export function toSmallThumbnailUrl(url: string) {
  return url.replace('/images/', '/images/small/');
}

export function toLargeThumbnailUrl(url: string) {
  return url.replace('/images/', '/images/1280x/');
}
