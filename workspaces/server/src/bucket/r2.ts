import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  endpoint: 'https://86d8f545823c67dcd13d89657854d6ad.r2.cloudflarestorage.com', // R2 固有のエンドポイント
  region: 'auto', // R2 の場合 region は 'auto' と指定
  credentials: {
    accessKeyId: '91bc2c6686a55a94fbdbab9279d0496f',
    secretAccessKey: 'a4f9666ad5e69f3dd27e0cbdc6c79aa4ebc1ee73370c6461328a5eefd8dfec83',
  },
});

// SSR 結果の文字列をアップロード
async function cacheSSRResultInR2(bucketName: string, key: string, html: string) {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: html,
      ContentType: 'text/html', // HTML を保存する場合
    }),
  );
}
  
  // SSR 結果をダウンロード
async function getSSRResultFromR2(bucketName: string, key: string): Promise<string | null> {
  try {
    const data = await r2Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
    // data.Body はストリーム (Readable) なので、文字列に変換
    const stream = data.Body as NodeJS.ReadableStream;
    let html = '';
    for await (const chunk of stream) {
      html += chunk.toString();
    }
    return html;
  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      return null; // 存在しない場合は null
    }
    throw error; // それ以外のエラーはそのまま投げる
  }
}

async function getStaticAssetFromR2(bucketName: string, key: string): Promise<Buffer | null> {
    try {
      const data = await r2Client.send(new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }));
      const chunks: Uint8Array[] = [];
      const stream = data.Body as NodeJS.ReadableStream;
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    } catch (err: any) {
      if (err.name === 'NoSuchKey') return null;
      console.error('[R2 getStaticAsset error]', err);
      throw err;
    }
  }
  
  async function cacheStaticAssetInR2(bucketName: string, key: string, data: Buffer, contentType: string) {
    try {
      await r2Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data,
        ContentType: contentType,
      }));
    } catch (err) {
      console.error('[R2 putObject error]', err);
      throw err;
    }
  }

export { r2Client, cacheSSRResultInR2, getSSRResultFromR2, getStaticAssetFromR2, cacheStaticAssetInR2 };
  