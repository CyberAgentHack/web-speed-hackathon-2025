// ?version= のクエリを削除する
export const removeVersionQuery = (url: string) => {
  return url.replace(/\?version=[^&]+/, '');
};
