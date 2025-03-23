/* eslint-disable sort/object-properties */
import 'zod-openapi/extend';

import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import * as databaseSchema from '@wsh-2025/schema/src/database/schema';

function assertSchema<T>(_actual: z.ZodType<NoInfer<T>>, _expected: z.ZodType<T>): void {}

const channel = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  logoUrl: z.string().openapi({ example: 'https://image.example.com/assets/d13d2e22-a7ff-44ba-94a3-5f025f2b63cd.png' }),
  name: z.string().openapi({ example: 'AREMA NEWS' }),
});
assertSchema(channel, createSelectSchema(databaseSchema.channel));

const episode = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  title: z.string().openapi({ example: '第1話 吾輩は猫である' }),
  description: z.string().openapi({
    example:
      '『吾輩は猫である』（わがはいはねこである）は、夏目漱石の長編小説であり、処女小説である。1905年（明治38年）1月、『ホトトギス』にて発表されたのだが、好評を博したため、翌1906年（明治39年）8月まで継続した。上、1906年10月刊、中、1906年11月刊、下、1907年5月刊。この文章は、クリエイティブ・コモンズ 表示-継承 4.0 国際 パブリック・ライセンスのもとで公表されたウィキペディアの項目「吾輩は猫である」（https://ja.wikipedia.org/wiki/吾輩は猫である）を素材として二次利用しています。',
  }),
  order: z.number().openapi({ example: 1 }),
  seriesId: z.string().openapi({ format: 'uuid' }),
  streamId: z.string().openapi({ format: 'uuid' }),
  thumbnailUrl: z.string().openapi({
    example: 'https://image.example.com/assets/d13d2e22-a7ff-44ba-94a3-5f025f2b63cd.png',
  }),
  premium: z.boolean().openapi({ example: false }),
});
assertSchema(episode, createSelectSchema(databaseSchema.episode));

const series = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  title: z.string().openapi({ example: '吾輩は猫である' }),
  description: z.string().openapi({
    example:
      '『吾輩は猫である』（わがはいはねこである）は、夏目漱石の長編小説であり、処女小説である。1905年（明治38年）1月、『ホトトギス』にて発表されたのだが、好評を博したため、翌1906年（明治39年）8月まで継続した。上、1906年10月刊、中、1906年11月刊、下、1907年5月刊。この文章は、クリエイティブ・コモンズ 表示-継承 4.0 国際 パブリック・ライセンスのもとで公表されたウィキペディアの項目「吾輩は猫である」（https://ja.wikipedia.org/wiki/吾輩は猫である）を素材として二次利用しています。',
  }),
  thumbnailUrl: z.string().openapi({
    example: 'https://image.example.com/assets/d13d2e22-a7ff-44ba-94a3-5f025f2b63cd.png',
  }),
});
assertSchema(series, createSelectSchema(databaseSchema.series));

const program = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  title: z.string().openapi({ example: '吾輩は猫である' }),
  description: z.string().openapi({
    example:
      '『吾輩は猫である』（わがはいはねこである）は、夏目漱石の長編小説であり、処女小説である。1905年（明治38年）1月、『ホトトギス』にて発表されたのだが、好評を博したため、翌1906年（明治39年）8月まで継続した。上、1906年10月刊、中、1906年11月刊、下、1907年5月刊。この文章は、クリエイティブ・コモンズ 表示-継承 4.0 国際 パブリック・ライセンスのもとで公表されたウィキペディアの項目「吾輩は猫である」（https://ja.wikipedia.org/wiki/吾輩は猫である）を素材として二次利用しています。',
  }),
  startAt: z.string().openapi({ format: 'date-time' }),
  endAt: z.string().openapi({ format: 'date-time' }),
  thumbnailUrl: z.string().openapi({
    example: 'https://image.example.com/assets/d13d2e22-a7ff-44ba-94a3-5f025f2b63cd.png',
  }),
  channelId: z.string().openapi({ format: 'uuid' }),
  episodeId: z.string().openapi({ format: 'uuid' }),
});
assertSchema(program, createSelectSchema(databaseSchema.program));

const recommendedModule = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  order: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: '『チャンスの時間』を見ていたあなたにオススメ' }),
  referenceId: z.string().openapi({ format: 'uuid' }),
  type: z.enum(['carousel', 'jumbotron']).openapi({ example: 'carousel' }),
});
assertSchema(recommendedModule, createSelectSchema(databaseSchema.recommendedModule));

const recommendedItem = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  order: z.number().openapi({ example: 1 }),
  seriesId: z.string().nullable().openapi({ format: 'uuid' }),
  episodeId: z.string().nullable().openapi({ format: 'uuid' }),
  moduleId: z.string().openapi({ format: 'uuid' }),
});
assertSchema(recommendedItem, createSelectSchema(databaseSchema.recommendedItem));

const user = z.object({
  id: z.number().openapi({ format: '0' }),
  email: z.string().openapi({ example: 'user123' }),
  password: z.string().openapi({ example: 'password123' }),
});
assertSchema(user, createSelectSchema(databaseSchema.user));

// GET /channels
export const getChannelsRequestQuery = z.object({
  channelIds: z.string().optional(),
});
export const getChannelsResponse = z.array(channel.extend({}));

// GET /channels/:channelId
export const getChannelByIdRequestParams = z.object({
  channelId: z.string(),
});
export const getChannelByIdResponse = channel.extend({});

// GET /episodes
export const getEpisodesRequestQuery = z.object({
  episodeIds: z.string().optional(),
});
export const getEpisodesResponse = z.array(
  episode.extend({
    series: series.extend({
      episodes: z.array(episode.extend({})),
    }),
  }),
);

// GET /episodes/:episodeId
export const getEpisodeByIdRequestParams = z.object({
  episodeId: z.string(),
});
export const getEpisodeByIdResponse = episode.extend({
  series: series.extend({
    episodes: z.array(episode.extend({})),
  }),
});

// GET /series
export const getSeriesRequestQuery = z.object({
  seriesIds: z.string().optional(),
});
export const getSeriesResponse = z.array(
  series.extend({
    episodes: z.array(episode.extend({})),
  }),
);

// GET /series/:seriesId
export const getSeriesByIdRequestParams = z.object({
  seriesId: z.string(),
});
export const getSeriesByIdResponse = series.extend({
  episodes: z.array(episode.extend({})),
});

// GET /timetable
export const getTimetableRequestQuery = z.object({
  since: z.coerce.string().openapi({ format: 'date-time' }),
  until: z.coerce.string().openapi({ format: 'date-time' }),
});
export const getTimetableResponse = z.array(program.extend({}));

// GET /programs
export const getProgramsRequestQuery = z.object({
  programIds: z.string().optional(),
});
export const getProgramsResponse = z.array(
  program.extend({
    channel: channel.extend({}),
    episode: episode.extend({
      series: series.extend({
        episodes: z.array(episode.extend({})),
      }),
    }),
  }),
);

// GET /programs/:programId
export const getProgramByIdRequestParams = z.object({
  programId: z.string(),
});
export const getProgramByIdResponse = program.extend({
  channel: channel.extend({}),
  episode: episode.extend({
    series: series.extend({
      episodes: z.array(episode.extend({})),
    }),
  }),
});

// GET /recommended/:referenceId
export const getRecommendedModulesRequestParams = z.object({
  referenceId: z.string(),
});
export const getRecommendedModulesResponse = z.array(
  recommendedModule.extend({
    items: z.array(
      recommendedItem.extend({
        series: series
          // .extend({
            // episodes: z.array(episode.extend({})),
          // })
          .nullable(),
        episode: episode
          .extend({
            series: series
            // .extend({
            //   episodes: z.array(episode.extend({})),
            // }),
          })
          .nullable(),
      }),
    ),
  }),
);

// POST /signIn
export const signInRequestBody = z.object({
  email: z.string(),
  password: z.string(),
});
export const signInResponse = z.object({
  id: z.number(),
  email: z.string(),
});

// POST /signUp
export const signUpRequestBody = z.object({
  email: z.string(),
  password: z.string(),
});
export const signUpResponse = z.object({
  id: z.number(),
  email: z.string(),
});

// GET /users/me
export const getUserResponse = z.object({
  id: z.number(),
  email: z.string(),
});
