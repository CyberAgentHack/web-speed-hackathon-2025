import { z } from 'zod';

// APIレスポンス用のZodスキーマ定義 - より柔軟な定義に変更
const episodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable().default(''),
  thumbnailUrl: z.string().optional().nullable().default(''),
  order: z.number().optional().nullable().default(0),
  seriesId: z.string().optional().nullable().default(''),
  streamId: z.string().optional().nullable().default(''),
  premium: z.boolean().optional().nullable().default(false),
  // seriesは任意に変更
  series: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional().nullable().default(''),
      thumbnailUrl: z.string().optional().nullable().default(''),
      episodes: z.array(z.any()).optional().nullable().default([]),
    })
    .optional()
    .nullable(),
});

const seriesSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable().default(''),
  thumbnailUrl: z.string().optional().nullable().default(''),
  episodes: z.array(z.any()).optional().nullable().default([]),
});

const recommendedItemSchema = z.object({
  id: z.string(),
  order: z.number().optional().nullable().default(0),
  seriesId: z.string().nullable().optional(),
  episodeId: z.string().nullable().optional(),
  moduleId: z.string(),
  series: seriesSchema.nullable().optional(),
  episode: episodeSchema.nullable().optional(),
});

const recommendedModuleSchema = z.object({
  id: z.string(),
  order: z.number().optional().nullable().default(0),
  title: z.string(),
  referenceId: z.string(),
  type: z.enum(['carousel', 'jumbotron']),
  items: z.array(recommendedItemSchema),
});

// 型定義をスキーマから生成
export type RecommendedItem = {
  id: string;
  order: number; // nullを許容しない
  seriesId: string | null;
  episodeId: string | null;
  moduleId: string;
  series: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    episodes: Array<{
      id: string;
      title: string;
      description: string;
      thumbnailUrl: string;
      order: number;
      seriesId: string;
      streamId: string;
      premium: boolean;
    }>;
  } | null;
  episode: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    order: number;
    seriesId: string;
    streamId: string;
    premium: boolean;
    series: {
      id: string;
      title: string;
      description: string;
      thumbnailUrl: string;
      episodes: Array<{
        id: string;
        title: string;
        description: string;
        thumbnailUrl: string;
        order: number;
        seriesId: string;
        streamId: string;
        premium: boolean;
      }>;
    };
  } | null;
};

export type RecommendedModule = {
  id: string;
  order: number; // nullを許容しない
  title: string;
  referenceId: string;
  type: 'carousel' | 'jumbotron';
  items: RecommendedItem[];
};

// 必要なインターフェース定義
interface EpisodeData {
  id?: string;
  title?: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  order?: number | null;
  seriesId?: string | null;
  streamId?: string | null;
  premium?: boolean | null;
  series?: SeriesData | null;
}

interface SeriesData {
  id?: string;
  title?: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  episodes?: EpisodeData[] | null;
}

interface RecommendedService {
  fetchRecommendedModulesByReferenceId: (params: { referenceId: string }) => Promise<RecommendedModule[]>;
}

export const recommendedService: RecommendedService = {
  async fetchRecommendedModulesByReferenceId({ referenceId }) {
    try {
      console.log(`recommendedService: ${referenceId}のデータ取得開始`);

      // 直接fetchを使用
      const response = await fetch(`/api/recommended/${referenceId}`);

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log(`recommendedService: 生データ取得`, typeof rawData, Array.isArray(rawData));

      // スキーマバリデーションを実行して型を保証
      try {
        // 柔軟なスキーマでバリデーション
        const rawValidatedData = z.array(recommendedModuleSchema).parse(rawData);

        // nullableフィールドをnon-nullableに変換（厳格な型に正規化）
        const validatedData: RecommendedModule[] = rawValidatedData.map((module) => ({
          id: module.id,
          order: module.order ?? 0, // nullの場合は0を使用
          title: module.title,
          referenceId: module.referenceId,
          type: module.type,
          items: module.items.map((item) => {
            // episode処理のためのローカル変数
            const episodeData = item.episode && typeof item.episode === 'object' ? item.episode : null;
            const episodeSeriesData =
              episodeData?.series && typeof episodeData.series === 'object' ? episodeData.series : null;

            return {
              id: item.id,
              order: item.order ?? 0, // nullの場合は0を使用
              seriesId: item.seriesId ?? null,
              episodeId: item.episodeId ?? null,
              moduleId: item.moduleId,
              series: item.series
                ? {
                    id: item.series.id,
                    title: item.series.title,
                    description: item.series.description ?? '',
                    thumbnailUrl: item.series.thumbnailUrl ?? '',
                    episodes: Array.isArray(item.series.episodes)
                      ? item.series.episodes.map((ep: EpisodeData) => ({
                          id: ep.id || '',
                          title: ep.title || '',
                          description: ep.description ?? '',
                          thumbnailUrl: ep.thumbnailUrl ?? '',
                          order: typeof ep.order === 'number' ? ep.order : 0,
                          seriesId: ep.seriesId ?? item.series?.id ?? '',
                          streamId: ep.streamId ?? '',
                          premium: ep.premium ?? false,
                        }))
                      : [],
                  }
                : null,
              episode: episodeData
                ? {
                    id: episodeData.id || '',
                    title: episodeData.title || '',
                    description: episodeData.description ?? '',
                    thumbnailUrl: episodeData.thumbnailUrl ?? '',
                    order: episodeData.order ?? 0,
                    seriesId: episodeData.seriesId ?? '',
                    streamId: episodeData.streamId ?? '',
                    premium: episodeData.premium ?? false,
                    series: episodeSeriesData
                      ? {
                          id: episodeSeriesData.id || '',
                          title: episodeSeriesData.title || '',
                          description: episodeSeriesData.description ?? '',
                          thumbnailUrl: episodeSeriesData.thumbnailUrl ?? '',
                          episodes: Array.isArray(episodeSeriesData.episodes)
                            ? episodeSeriesData.episodes.map((ep: EpisodeData) => ({
                                id: ep.id || '',
                                title: ep.title || '',
                                description: ep.description ?? '',
                                thumbnailUrl: ep.thumbnailUrl ?? '',
                                order: typeof ep.order === 'number' ? ep.order : 0,
                                seriesId: ep.seriesId ?? episodeSeriesData?.id ?? '',
                                streamId: ep.streamId ?? '',
                                premium: ep.premium ?? false,
                              }))
                            : [],
                        }
                      : {
                          // 強制的に空のオブジェクトを設定（series必須のため）
                          id: '',
                          title: '',
                          description: '',
                          thumbnailUrl: '',
                          episodes: [],
                        },
                  }
                : null,
            };
          }),
        }));

        console.log(`recommendedService: ${referenceId}のデータ取得成功`, validatedData.length);
        return validatedData;
      } catch (validationError) {
        console.error('recommendedService: スキーマバリデーションエラー', validationError);

        // バリデーションエラーでも最低限のデータを返す
        if (Array.isArray(rawData)) {
          // 空の配列を返すか、最低限必要な構造に変換する
          const fallbackModules: RecommendedModule[] = rawData.map((module: Record<string, unknown>) => {
            const moduleId = (module.id as string) || String(Math.random());
            return {
              id: moduleId,
              order: typeof module.order === 'number' ? module.order : 0,
              title: (module.title as string) || '無題',
              referenceId: (module.referenceId as string) || referenceId,
              type: (module.type as 'jumbotron' | 'carousel') === 'jumbotron' ? 'jumbotron' : 'carousel',
              items: Array.isArray(module.items)
                ? module.items.map((item: Record<string, unknown>): RecommendedItem => {
                    return {
                      id: (item.id as string) || String(Math.random()),
                      order: typeof item.order === 'number' ? item.order : 0,
                      seriesId: (item.seriesId as string) || null,
                      episodeId: (item.episodeId as string) || null,
                      moduleId,
                      series: null,
                      episode: null,
                    };
                  })
                : [],
            };
          });

          return fallbackModules;
        }

        return [];
      }
    } catch (error) {
      console.error(`recommendedService: ${referenceId}のデータ取得エラー`, error);
      throw error;
    }
  },
};
