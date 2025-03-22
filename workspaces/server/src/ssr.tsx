// SSR の例: HTML 生成部分
const heroImageWidth = 1280;
const heroImageHeight = 720;

// 例: 直接 img タグを組み立てる
const heroImageHtml = `
  <imges
    src="/public/images/hero.jpg"
    alt="Hero"
    width="${heroImageWidth}"
    height="${heroImageHeight}"
    style="width:100%;height:auto;"
    fetchpriority="high"
    decoding="async"
  />
`;

// あるいは React で返すなら:
function HeroImage() {
  return (
    <imges
      src="/public/images/hero.jpg"
      alt="Hero"
      width={heroImageWidth}
      height={heroImageHeight}
      style={{ width: '100%', height: 'auto' }}
      fetchPriority="high" // React 18.3以降でサポート
      decoding="async"
    />
  );
}
