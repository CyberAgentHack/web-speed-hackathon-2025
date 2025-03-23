/* eslint-disable sort/object-properties */
//ZotをValibotへ変更
import { v } from 'valibot';

import * as databaseSchema from '@wsh-2025/schema/src/database/schema';

function assertSchema<T>(_actual: v.BaseSchema<T>, _expected: v.BaseSchema<T>): void {}

const schemaCache = new Map();

function getCachedSchema<T>(key: string, schemaFn: () => v.BaseSchema<T>): v.BaseSchema<T> {
  if (!schemaCache.has(key)) {
    schemaCache.set(key, schemaFn());
  }
  return schemaCache.get(key);
}

const channel = getCachedSchema('channel', () => v.object({
  id: v.string([v.uuid()]),
  logoUrl: v.string(),
  name: v.string(),
}));
assertSchema(channel, databaseSchema.channel);

const episode = getCachedSchema('episode', () => v.object({
  id: v.string([v.uuid()]),
  title: v.string(),
  description: v.string(),
  order: v.number(),
  seriesId: v.string([v.uuid()]),
  streamId: v.string([v.uuid()]),
  thumbnailUrl: v.string(),
  premium: v.boolean(),
}));
assertSchema(episode, databaseSchema.episode);

const series = getCachedSchema('series', () => v.object({
  id: v.string([v.uuid()]),
  title: v.string(),
  description: v.string(),
  thumbnailUrl: v.string(),
}));
assertSchema(series, databaseSchema.series);

const program = getCachedSchema('program', () => v.object({
  id: v.string([v.uuid()]),
  title: v.string(),
  description: v.string(),
  startAt: v.string([v.datetime()]),
  endAt: v.string([v.datetime()]),
  thumbnailUrl: v.string(),
  channelId: v.string([v.uuid()]),
  episodeId: v.string([v.uuid()]),
}));
assertSchema(program, databaseSchema.program);

const recommendedModule = getCachedSchema('recommendedModule', () => v.object({
  id: v.string([v.uuid()]),
  order: v.number(),
  title: v.string(),
  referenceId: v.string([v.uuid()]),
  type: v.union([v.literal('carousel'), v.literal('jumbotron')]),
}));
assertSchema(recommendedModule, databaseSchema.recommendedModule);

const recommendedItem = getCachedSchema('recommendedItem', () => v.object({
  id: v.string([v.uuid()]),
  order: v.number(),
  seriesId: v.nullable(v.string([v.uuid()])),
  episodeId: v.nullable(v.string([v.uuid()])),
  moduleId: v.string([v.uuid()]),
}));
assertSchema(recommendedItem, databaseSchema.recommendedItem);

const user = getCachedSchema('user', () => v.object({
  id: v.number(),
  email: v.string([v.email()]),
  password: v.string(),
}));
assertSchema(user, databaseSchema.user);

// GET /channels
export const getChannelsRequestQuery = v.object({
  channelIds: v.optional(v.string()),
});
export const getChannelsResponse = v.array(channel);

// GET /channels/:channelId
export const getChannelByIdRequestParams = v.object({
  channelId: v.string([v.uuid()]),
});
export const getChannelByIdResponse = channel;

// GET /episodes
export const getEpisodesRequestQuery = v.object({
  episodeIds: v.optional(v.string()),
});
export const getEpisodesResponse = v.array(
  v.object({
    ...episode.definition,
    series: v.object({
      ...series.definition,
      episodes: v.array(episode),
    }),
  })
);

// GET /episodes/:episodeId
export const getEpisodeByIdRequestParams = v.object({
  episodeId: v.string([v.uuid()]),
});
export const getEpisodeByIdResponse = v.object({
  ...episode.definition,
  series: v.object({
    ...series.definition,
    episodes: v.array(episode),
  }),
});

// GET /series
export const getSeriesRequestQuery = v.object({
  seriesIds: v.optional(v.string()),
});
export const getSeriesResponse = v.array(
  v.object({
    ...series.definition,
    episodes: v.array(episode),
  })
);

// GET /series/:seriesId
export const getSeriesByIdRequestParams = v.object({
  seriesId: v.string([v.uuid()]),
});
export const getSeriesByIdResponse = v.object({
  ...series.definition,
  episodes: v.array(episode),
});

// GET /timetable
export const getTimetableRequestQuery = v.object({
  since: v.string([v.datetime()]),
  until: v.string([v.datetime()]),
});
export const getTimetableResponse = v.array(program);

// GET /programs
export const getProgramsRequestQuery = v.object({
  programIds: v.optional(v.string()),
});
export const getProgramsResponse = v.array(
  v.object({
    ...program.definition,
    channel: channel,
    episode: v.object({
      ...episode.definition,
      series: v.object({
        ...series.definition,
        episodes: v.array(episode),
      }),
    }),
  })
);

// GET /programs/:programId
export const getProgramByIdRequestParams = v.object({
  programId: v.string([v.uuid()]),
});
export const getProgramByIdResponse = v.object({
  ...program.definition,
  channel: channel,
  episode: v.object({
    ...episode.definition,
    series: v.object({
      ...series.definition,
      episodes: v.array(episode),
    }),
  }),
});

// GET /recommended/:referenceId
export const getRecommendedModulesRequestParams = v.object({
  referenceId: v.string([v.uuid()]),
});
export const getRecommendedModulesResponse = v.array(
  v.object({
    ...recommendedModule.definition,
    items: v.array(
      v.object({
        ...recommendedItem.definition,
        series: v.nullable(
          v.object({
            ...series.definition,
            episodes: v.array(episode),
          })
        ),
        episode: v.nullable(
          v.object({
            ...episode.definition,
            series: v.object({
              ...series.definition,
              episodes: v.array(episode),
            }),
          })
        ),
      })
    ),
  })
);

// POST /signIn
export const signInRequestBody = v.object({
  email: v.string([v.email()]),
  password: v.string(),
});
export const signInResponse = v.object({
  id: v.number(),
  email: v.string([v.email()]),
});

// POST /signUp
export const signUpRequestBody = v.object({
  email: v.string([v.email()]),
  password: v.string(),
});
export const signUpResponse = v.object({
  id: v.number(),
  email: v.string([v.email()]),
});

// GET /users/me
export const getUserResponse = v.object({
  id: v.number(),
  email: v.string([v.email()]),
});
