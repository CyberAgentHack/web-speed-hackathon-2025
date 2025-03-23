- TOPのサーバーレスポンスが一番重い
  - clientはReact Router v7を使っている
    - p-min-lazyを使って最低1秒まつようになっている
      - サーバーサイドで読み込んでいるせい？ https://react-router-docs-ja.techtalk.jp/start/framework/data-loading#%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%83%87%E3%83%BC%E3%82%BF%E3%83%AD%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0
    - TOPページのフィードのネスト構造をprefetch関数で取得している
    - storeでも同じfetchしてる？
- fastifyのlogレベル有効か
- /api/recommended/entranceのレスポンス時間が1.7秒
  - carouselとitemを分けれるんじゃないか

- SWR 入れた
- HomePageの再レンダリング治らない
  - 複数のコンテキストがまとまっている
  - まずはlayoutだけ切り離す
  - https://github.com/dhmk083/dhmk-zustand-lens これを上手く使えてない


- 次のボトルネック
  - main.js
    - 161MBもあり、ダウンロードに時間がかかる
      - webpackでビルドしている
        - new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        - バンドル分析する
    - サーバー応答待ち自体も長い

- ビルドのコマンドはpackage.json
- source-mapの分割で半分になった

https://webpack.js.org/guides/code-splitting/#bundle-analysis

- 大きく二つ
  - iconify+json
  - ffmpeg+core

- TOP以外のページテスト落ちる 

