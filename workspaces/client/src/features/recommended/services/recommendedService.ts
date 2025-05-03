import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/recommended/:referenceId': {
      output: schema.getRecommendedModulesResponse,
      params: schema.getRecommendedModulesRequestParams,
    },
  }),
  throw: true,
});

interface RecommendedService {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

// キャッシュの設定
const CACHE_TTL = 5 * 60 * 1000; // キャッシュの有効期限を5分に設定
const recommendedCache = new Map<string, StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>();
const cacheTimestamps = new Map<string, number>();

// バッチ処理用のキュー
let batchQueue: string[] = [];
let batchTimeout: NodeJS.Timeout | null = null;
const BATCH_WINDOW = 0; // バッチウィンドウを0msに設定（即時実行）
const MAX_BATCH_SIZE = 5; // 最大バッチサイズを制限

// プリフェッチ用のキュー
const prefetchQueue = new Set<string>();

export const recommendedService: RecommendedService = {
  async fetchRecommendedModulesByReferenceId({ referenceId }) {
    // キャッシュをチェック
    const cachedData = recommendedCache.get(referenceId);
    const timestamp = cacheTimestamps.get(referenceId);
    if (cachedData && timestamp && Date.now() - timestamp < CACHE_TTL) {
      return cachedData;
    }

    // プリフェッチキューに追加
    prefetchQueue.add(referenceId);

    // バッチキューに追加
    batchQueue.push(referenceId);
    
    // 既存のタイマーをクリア
    if (batchTimeout) {
      clearTimeout(batchTimeout);
    }

    // 新しいタイマーを設定
    return new Promise((resolve, reject) => {
      batchTimeout = setTimeout(async () => {
        // 重複を除去し、最大サイズを制限
        const uniqueIds = [...new Set(batchQueue)].slice(0, MAX_BATCH_SIZE);
        
        try {
          const data = await $fetch('/recommended/:referenceId', {
            params: { referenceId },
          });

          // キャッシュを更新
          recommendedCache.set(referenceId, data);
          cacheTimestamps.set(referenceId, Date.now());

          resolve(data);
        } catch (error) {
          console.error('Error fetching recommended modules:', error);
          reject(error);
        } finally {
          batchQueue = [];
        }
      }, BATCH_WINDOW);
    });
  },
};
