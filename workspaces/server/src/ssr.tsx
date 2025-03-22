import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export function registerSsr(app: FastifyInstance): void {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  const rootPath = path.resolve(__dirname, '../../../');
  const rootPublicPath = path.join(rootPath, 'public');

  console.log('Client dist path:', clientDistPath);
  console.log('Root project path:', rootPath);
  console.log('Root public path:', rootPublicPath);

  // client/distのassetsディレクトリを/assetsプレフィックスで提供
  app.register(fastifyStatic, {
    root: path.join(clientDistPath, 'assets'),
    prefix: '/assets/',
    decorateReply: false,
    logLevel: 'info', // ログレベルを上げて問題を診断
    setHeaders: (res, filePath) => {
      console.log('Serving asset file:', filePath);
      // JavaScriptファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
      // CSSファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
      // マップファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.map')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      // SVGファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
      // WASMファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      }
    },
  });

  // ルートプロジェクトのpublicディレクトリを配信
  app.register(fastifyStatic, {
    root: rootPublicPath,
    prefix: '/public/',
    decorateReply: false,
    setHeaders: (res, filePath) => {
      console.log('Serving public file:', filePath);
      // SVGファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
    },
  });

  // favicon.icoの特別なルートを追加
  app.get('/favicon.ico', (_, reply) => {
    reply.sendFile('favicon.ico', clientDistPath);
  });

  // 静的アセットの拡張子をチェックし、NotFoundHandlerに渡さないようにする
  app.addHook('onRequest', (request, reply, done) => {
    const url = request.url;
    // アセットリクエストをログに記録
    if (url.startsWith('/assets/') || url.startsWith('/public/')) {
      console.log('Asset request:', url);
    }

    // 静的アセットの拡張子を持つURLはNotFoundHandlerに渡さない
    if (
      url.endsWith('.js') ||
      url.endsWith('.css') ||
      url.endsWith('.map') ||
      url.endsWith('.svg') ||
      url.endsWith('.wasm') ||
      url.endsWith('.jpg') ||
      url.endsWith('.png') ||
      url.endsWith('.ico') ||
      url.endsWith('.json')
    ) {
      // 静的ファイルハンドラに任せる
      // 存在しない場合は自動的に404になる
      done();
      return;
    }
    done();
  });

  // クライアントのdistディレクトリをルートとして配信（最後に登録して優先度を下げる）
  app.register(fastifyStatic, {
    root: clientDistPath,
    prefix: '/',
    logLevel: 'info', // ログレベルを上げて問題を診断
    setHeaders: (res, filePath) => {
      console.log('Serving root file:', filePath);
      // JavaScriptファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
      // CSSファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
      // マップファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.map')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      // SVGファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
      // WASMファイルに適切なMIMEタイプを設定
      if (filePath.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      }
    },
  });

  // SPA対応：存在しないパスへのリクエストはすべてindex.htmlにリダイレクト
  app.setNotFoundHandler((request, reply) => {
    // APIリクエストの場合は通常の404を返す
    if (request.url.startsWith('/api/')) {
      return;
    }

    // 拡張子がある場合は通常の404を返す（静的ファイルが見つからない場合）
    if (request.url.includes('.') && !request.url.endsWith('.html')) {
      console.log('Not found with extension:', request.url);
      return;
    }

    // その他のリクエストはindex.htmlを返す
    console.log('Serving index.html for:', request.url);
    reply.sendFile('index.html', clientDistPath);
  });
}
