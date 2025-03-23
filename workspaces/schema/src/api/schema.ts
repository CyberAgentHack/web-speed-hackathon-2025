import { z } from 'zod';

import * as openapiSchema from '@wsh-2025/schema/src/openapi/schema';

// GET /channels
export type GetChannelsRequestQuery = z.infer<typeof openapiSchema.getChannelsRequestQuery>;
export type GetChannelsResponse = z.infer<typeof openapiSchema.getChannelsResponse>;

// GET /channels/:channelId
export type GetChannelByIdRequestParams = z.infer<typeof openapiSchema.getChannelByIdRequestParams>;
export type GetChannelByIdResponse = z.infer<typeof openapiSchema.getChannelByIdResponse>;

// GET /episodes
export type GetEpisodesRequestQuery = z.infer<typeof openapiSchema.getEpisodesRequestQuery>;
export type GetEpisodesResponse = z.infer<typeof openapiSchema.getEpisodesResponse>;

// GET /episodes/:episodeId
export type GetEpisodeByIdRequestParams = z.infer<typeof openapiSchema.getEpisodeByIdRequestParams>;
export type GetEpisodeByIdResponse = z.infer<typeof openapiSchema.getEpisodeByIdResponse>;

// GET /series
export type GetSeriesRequestQuery = z.infer<typeof openapiSchema.getSeriesRequestQuery>;
export type GetSeriesResponse = z.infer<typeof openapiSchema.getSeriesResponse>;

// GET /series/:seriesId
export type GetSeriesByIdRequestParams = z.infer<typeof openapiSchema.getSeriesByIdRequestParams>;
export type GetSeriesByIdResponse = z.infer<typeof openapiSchema.getSeriesByIdResponse>;

// GET /timetable
export type GetTimetableRequestQuery = z.infer<typeof openapiSchema.getTimetableRequestQuery>;
export type GetTimetableResponse = z.infer<typeof openapiSchema.getTimetableResponse>;

// GET /programs
export type GetProgramsRequestQuery = z.infer<typeof openapiSchema.getProgramsRequestQuery>;
export type GetProgramsResponse = z.infer<typeof openapiSchema.getProgramsResponse>;

// GET /programs/:programId
export type GetProgramByIdRequestParams = z.infer<typeof openapiSchema.getProgramByIdRequestParams>;
export type GetProgramByIdResponse = z.infer<typeof openapiSchema.getProgramByIdResponse>;

// GET /recommended/:referenceId
export type GetRecommendedModulesRequestParams = z.infer<typeof openapiSchema.getRecommendedModulesRequestParams>;
export type GetRecommendedModulesResponse = z.infer<typeof openapiSchema.getRecommendedModulesResponse>;
// POST /signIn
export type SignInRequestBody = z.infer<typeof openapiSchema.signInRequestBody>;
export type SignInResponse = z.infer<typeof openapiSchema.signInResponse>;

// POST /signUp
export type SignUpRequestBody = z.infer<typeof openapiSchema.signUpRequestBody>;
export type SignUpResponse = z.infer<typeof openapiSchema.signUpResponse>;

// GET /users/me
export type GetUserResponse = z.infer<typeof openapiSchema.getUserResponse>;
