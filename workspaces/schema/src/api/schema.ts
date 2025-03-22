import { Compile } from "@sinclair/typemap";

import * as openapiSchema from "@wsh-2025/schema/src/openapi/schema";

export const getChannelsRequestQuery = Compile(
	openapiSchema.getChannelsRequestQuery,
);
export const getChannelsResponse = Compile(openapiSchema.getChannelsResponse);
export const getChannelByIdRequestParams = Compile(
	openapiSchema.getChannelByIdRequestParams,
);
export const getChannelByIdResponse = Compile(
	openapiSchema.getChannelByIdResponse,
);
export const getEpisodesRequestQuery = Compile(
	openapiSchema.getEpisodesRequestQuery,
);
export const getEpisodesResponse = Compile(openapiSchema.getEpisodesResponse);
export const getEpisodeByIdRequestParams = Compile(
	openapiSchema.getEpisodeByIdRequestParams,
);
export const getEpisodeByIdResponse = Compile(
	openapiSchema.getEpisodeByIdResponse,
);
export const getSeriesRequestQuery = Compile(
	openapiSchema.getSeriesRequestQuery,
);
export const getSeriesResponse = Compile(openapiSchema.getSeriesResponse);
export const getSeriesByIdRequestParams = Compile(
	openapiSchema.getSeriesByIdRequestParams,
);
export const getSeriesByIdResponse = Compile(
	openapiSchema.getSeriesByIdResponse,
);
export const getTimetableRequestQuery = Compile(
	openapiSchema.getTimetableRequestQuery,
);
export const getTimetableResponse = Compile(openapiSchema.getTimetableResponse);
export const getProgramsRequestQuery = Compile(
	openapiSchema.getProgramsRequestQuery,
);
export const getProgramsResponse = Compile(openapiSchema.getProgramsResponse);
export const getProgramByIdRequestParams = Compile(
	openapiSchema.getProgramByIdRequestParams,
);
export const getProgramByIdResponse = Compile(
	openapiSchema.getProgramByIdResponse,
);
export const getRecommendedModulesRequestParams = Compile(
	openapiSchema.getRecommendedModulesRequestParams,
);
export const getRecommendedModulesResponse = Compile(
	openapiSchema.getRecommendedModulesResponse,
);
export const signInRequestBody = Compile(openapiSchema.signInRequestBody);
export const signInResponse = Compile(openapiSchema.signInResponse);
export const signUpRequestBody = Compile(openapiSchema.signUpRequestBody);
export const signUpResponse = Compile(openapiSchema.signUpResponse);
export const getUserResponse = Compile(openapiSchema.getUserResponse);
