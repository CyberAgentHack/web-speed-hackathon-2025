import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

// 静的アセットを提供するMIMEタイプ設定
const setAppropriateHeaders = (res: { setHeader: (name: string, value: string) => void }, filePath: string): void => {
  // JavaScriptファイルに適切なMIMEタイプを設定
  if (filePath.endsWith('.js') || filePath.match(/\.js\.\d+/)) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  // CSSファイルに適切なMIMEタイプを設定
  if (filePath.endsWith('.css') || filePath.match(/\.css\.\d+/)) {
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
};

export function registerSsr(app: FastifyInstance): void {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  const rootPath = path.resolve(__dirname, '../../../');
  const rootPublicPath = path.join(rootPath, 'public');
  const clientDistAssetsPath = path.join(clientDistPath, 'assets');

  console.log('Client dist path:', clientDistPath);
  console.log('Client assets path:', clientDistAssetsPath);
  console.log('Root project path:', rootPath);
  console.log('Root public path:', rootPublicPath);

  // client/distのassetsディレクトリを/assetsプレフィックスで提供
  app.register(fastifyStatic, {
    root: clientDistAssetsPath,
    prefix: '/assets/',
    decorateReply: false,
    logLevel: 'info',
    setHeaders: setAppropriateHeaders,
  });

  // ルートプロジェクトのpublicディレクトリを配信
  app.register(fastifyStatic, {
    root: rootPublicPath,
    prefix: '/public/',
    decorateReply: false,
    setHeaders: setAppropriateHeaders,
  });

  // favicon.icoの特別なルートを追加（複数のパスを試みる）
  app.get('/favicon.ico', (_, reply) => {
    // まず公開ディレクトリから探す
    const publicFaviconPath = path.join(rootPublicPath, 'favicon.ico');
    if (fs.existsSync(publicFaviconPath)) {
      console.log('Serving favicon from public directory:', publicFaviconPath);
      return reply.sendFile('favicon.ico', rootPublicPath);
    }

    // 次にクライアントのdistディレクトリから探す
    const distFaviconPath = path.join(clientDistPath, 'favicon.ico');
    if (fs.existsSync(distFaviconPath)) {
      console.log('Serving favicon from client dist directory:', distFaviconPath);
      return reply.sendFile('favicon.ico', clientDistPath);
    }

    // 最後にルートディレクトリから探す
    const rootFaviconPath = path.join(rootPath, 'favicon.ico');
    if (fs.existsSync(rootFaviconPath)) {
      console.log('Serving favicon from root directory:', rootFaviconPath);
      return reply.sendFile('favicon.ico', rootPath);
    }

    // ファビコンが見つからない場合は404を返す
    console.log('Favicon not found in any directory');
    reply.code(404).send('Favicon not found');
  });

  // favicon.svgの特別なルートも追加
  app.get('/assets/favicon.svg', (_, reply) => {
    // まずclient/dist/assetsディレクトリから探す
    const distFaviconPath = path.join(clientDistPath, 'assets', 'favicon.svg');
    if (fs.existsSync(distFaviconPath)) {
      console.log('Serving favicon.svg from client dist assets:', distFaviconPath);
      return reply.sendFile(path.join('assets', 'favicon.svg'), clientDistPath);
    }

    // 次に公開ディレクトリから探す
    const publicFaviconPath = path.join(rootPublicPath, 'favicon.svg');
    if (fs.existsSync(publicFaviconPath)) {
      console.log('Serving favicon.svg from public directory:', publicFaviconPath);
      return reply.sendFile('favicon.svg', rootPublicPath);
    }

    // ファビコンSVGが見つからない場合は404を返す
    console.log('Favicon SVG not found in any directory');
    reply.code(404).send('Favicon SVG not found');
  });

  // アセットリクエストをログに記録
  app.addHook('onRequest', (request, reply, done) => {
    const url = request.url;
    // アセットリクエストをログに記録
    if (url.startsWith('/assets/') || url.startsWith('/public/')) {
      console.log('Asset request:', url);
    }
    done();
  });

  // クライアントのdistディレクトリをルートとして配信（最後に登録して優先度を下げる）
  app.register(fastifyStatic, {
    root: clientDistPath,
    prefix: '/',
    logLevel: 'info',
    setHeaders: setAppropriateHeaders,
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
