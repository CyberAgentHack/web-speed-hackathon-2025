import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  endpoint: 'https://<アカウントID>.r2.cloudflarestorage.com', // R2 固有のエンドポイント
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

export { cacheSSRResultInR2, getSSRResultFromR2 };
  