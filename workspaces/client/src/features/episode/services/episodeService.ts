import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/episodes': {
      output: schema.getEpisodesResponse,
      query: schema.getEpisodesRequestQuery,
    },
    '/episodes/:episodeId': {
      output: schema.getEpisodeByIdResponse,
      params: schema.getEpisodeByIdRequestParams,
    },
  }),
  throw: true,
});

interface EpisodeService {
  fetchEpisodeById: (params: {
    episodeId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
  fetchEpisodes: (params: {
    episodeIds?: string[];
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>>;
}

// キャッシュの設定
const CACHE_TTL = 5 * 60 * 1000; // キャッシュの有効期限を5分に設定
const episodeCache = new Map<string, StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>();
const cacheTimestamps = new Map<string, number>();

// バッチ処理用のキュー
let batchQueue: string[] = [];
let batchTimeout: NodeJS.Timeout | null = null;
const BATCH_WINDOW = 1; // バッチウィンドウを1msに短縮
const MAX_BATCH_SIZE = 10; // 最大バッチサイズを制限

export const episodeService: EpisodeService = {
  async fetchEpisodeById({ episodeId }) {
    // キャッシュをチェック
    const cachedEpisode = episodeCache.get(episodeId);
    const timestamp = cacheTimestamps.get(episodeId);
    if (cachedEpisode && timestamp && Date.now() - timestamp < CACHE_TTL) {
      return cachedEpisode;
    }

    // バッチキューに追加
    batchQueue.push(episodeId);
    
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
          const episodes = await this.fetchEpisodes({ episodeIds: uniqueIds });
          
          // キャッシュを更新
          const now = Date.now();
          episodes.forEach(episode => {
            episodeCache.set(episode.id, episode);
            cacheTimestamps.set(episode.id, now);
          });

          const episode = episodes.find(e => e.id === episodeId);
          if (!episode) {
            reject(new Error(`Episode not found: ${episodeId}`));
            return;
          }
          resolve(episode);
        } catch (error) {
          console.error('Error fetching episodes:', error);
          reject(error);
        } finally {
          batchQueue = [];
        }
      }, BATCH_WINDOW);
    });
  },

  async fetchEpisodes({ episodeIds }) {
    if (!episodeIds?.length) return [];
    
    const data = await $fetch('/episodes', {
      query: { episodeIds: episodeIds.join(',') },
    });
    return data;
  },
};
