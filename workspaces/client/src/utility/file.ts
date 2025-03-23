export function alterExterntion(filUrl: string): string{
  const regexp = /.jpeg|.png|.jpg/;
  if(regexp.test(filUrl)){
    return filUrl.replace(regexp, '.webp');
  }else{
    return filUrl;
  }
}