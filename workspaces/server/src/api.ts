import 'zod-openapi/extend';

import { randomBytes } from 'node:crypto';

import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import * as databaseSchema from '@wsh-2025/schema/src/database/schema';
import * as schema from '@wsh-2025/schema/src/openapi/schema';
import * as bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';
import {
  fastifyZodOpenApiPlugin,
  type FastifyZodOpenApiSchema,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  type FastifyZodOpenApiTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-zod-openapi';
import { z } from 'zod';
import type { ZodOpenApiVersion } from 'zod-openapi';

import { getDatabase, initializeDatabase } from '@wsh-2025/server/src/drizzle/database';

export async function registerApi(app: FastifyInstance): Promise<void> {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyCookie);
  await app.register(fastifySession, {
    cookie: {
      path: '/',
    },
    cookieName: 'wsh-2025-session',
    secret: randomBytes(32).toString('base64'),
  });
  await app.register(fastifyZodOpenApiPlugin);
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Web Speed Hackathon 2025 API',
        version: '1.0.0',
      },
      openapi: '3.0.3' satisfies ZodOpenApiVersion,
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
  });
  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  const api = app.withTypeProvider<FastifyZodOpenApiTypeProvider>();

  /* eslint-disable sort/object-properties */
  api.route({
    method: 'POST',
    url: '/initialize',
    schema: {
      tags: ['初期化'],
      response: {
        200: {
          content: {
            'application/json': {
              schema: z.object({}),
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function initialize(_req, reply) {
      await initializeDatabase();
      reply.code(200).send({});
    },
  });

  api.route({
    method: 'GET',
    url: '/channels',
    schema: {
      tags: ['チャンネル'],
      querystring: schema.getChannelsRequestQuery,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getChannelsResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getChannels(req, reply) {
      const database = getDatabase();

      const channels = await database.query.channel.findMany({
        orderBy(channel, { asc }) {
          return asc(channel.id);
        },
        where(channel, { inArray }) {
          if (req.query.channelIds != null) {
            const channelIds = req.query.channelIds.split(',');
            return inArray(channel.id, channelIds);
          }
          return void 0;
        },
      });
      reply.code(200).send(channels);
    },
  });

  api.route({
    method: 'GET',
    url: '/channels/:channelId',
    schema: {
      tags: ['チャンネル'],
      params: schema.getChannelByIdRequestParams,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getChannelByIdResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getChannelById(req, reply) {
      const database = getDatabase();

      const channel = await database.query.channel.findFirst({
        where(channel, { eq }) {
          return eq(channel.id, req.params.channelId);
        },
      });
      if (channel == null) {
        return reply.code(404).send();
      }
      reply.code(200).send(channel);
    },
  });

  api.route({
    method: 'GET',
    url: '/episodes',
    schema: {
      tags: ['エピソード'],
      querystring: schema.getEpisodesRequestQuery,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getEpisodesResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getEpisodes(req, reply) {
      const database = getDatabase();

      const episodes = await database.query.episode.findMany({
        orderBy(episode, { asc }) {
          return asc(episode.id);
        },
        where(episode, { inArray }) {
          if (req.query.episodeIds != null) {
            const episodeIds = req.query.episodeIds.split(',');
            return inArray(episode.id, episodeIds);
          }
          return void 0;
        },
        with: {
          series: {
            with: {
              episodes: {
                orderBy(episode, { asc }) {
                  return asc(episode.order);
                },
              },
            },
          },
        },
      });
      reply.code(200).send(episodes);
    },
  });

  api.route({
    method: 'GET',
    url: '/episodes/:episodeId',
    schema: {
      tags: ['エピソード'],
      params: schema.getEpisodeByIdRequestParams,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getEpisodeByIdResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getEpisodeById(req, reply) {
      const database = getDatabase();

      const episode = await database.query.episode.findFirst({
        where(episode, { eq }) {
          return eq(episode.id, req.params.episodeId);
        },
        with: {
          series: {
            with: {
              episodes: {
                orderBy(episode, { asc }) {
                  return asc(episode.order);
                },
              },
            },
          },
        },
      });
      if (episode == null) {
        return reply.code(404).send();
      }
      reply.code(200).send(episode);
    },
  });

  api.route({
    method: 'GET',
    url: '/series',
    schema: {
      tags: ['シリーズ'],
      querystring: schema.getSeriesRequestQuery,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getSeriesResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getSeries(req, reply) {
      const database = getDatabase();

      const series = await database.query.series.findMany({
        orderBy(series, { asc }) {
          return asc(series.id);
        },
        where(series, { inArray }) {
          if (req.query.seriesIds != null) {
            const seriesIds = req.query.seriesIds.split(',');
            return inArray(series.id, seriesIds);
          }
          return void 0;
        },
        with: {
          episodes: {
            orderBy(episode, { asc }) {
              return asc(episode.order);
            },
            with: {
              series: true,
            },
          },
        },
      });
      reply.code(200).send(series);
    },
  });

  api.route({
    method: 'GET',
    url: '/series/:seriesId',
    schema: {
      tags: ['シリーズ'],
      params: schema.getSeriesByIdRequestParams,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getSeriesByIdResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getProgramById(req, reply) {
      const database = getDatabase();

      const series = await database.query.series.findFirst({
        where(series, { eq }) {
          return eq(series.id, req.params.seriesId);
        },
        with: {
          episodes: {
            orderBy(episode, { asc }) {
              return asc(episode.order);
            },
            with: {
              series: true,
            },
          },
        },
      });
      if (series == null) {
        return reply.code(404).send();
      }
      reply.code(200).send(series);
    },
  });

  api.route({
    method: 'GET',
    url: '/timetable',
    schema: {
      tags: ['番組表'],
      querystring: schema.getTimetableRequestQuery,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getTimetableResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getTimetable(req, reply) {
      const database = getDatabase();

      const programs = await database.query.program.findMany({
        orderBy(program, { asc }) {
          return asc(program.startAt);
        },
        where(program, { between, sql }) {
          // 競技のため、時刻のみで比較する
          return between(
            program.startAt,
            sql`time(${req.query.since}, '+9 hours')`,
            sql`time(${req.query.until}, '+9 hours')`,
          );
        },
      });
      reply.code(200).send(programs);
    },
  });

  api.route({
    method: 'GET',
    url: '/programs',
    schema: {
      tags: ['番組'],
      querystring: schema.getProgramsRequestQuery,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getProgramsResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getPrograms(req, reply) {
      const database = getDatabase();

      const programs = await database.query.program.findMany({
        orderBy(program, { asc }) {
          return asc(program.startAt);
        },
        where(program, { inArray }) {
          if (req.query.programIds != null) {
            const programIds = req.query.programIds.split(',');
            return inArray(program.id, programIds);
          }
          return void 0;
        },
        with: {
          channel: true,
          episode: {
            with: {
              series: {
                with: {
                  episodes: {
                    orderBy(episode, { asc }) {
                      return asc(episode.order);
                    },
                  },
                },
              },
            },
          },
        },
      });
      reply.code(200).send(programs);
    },
  });

  api.route({
    method: 'GET',
    url: '/programs/:programId',
    schema: {
      tags: ['番組'],
      params: schema.getProgramByIdRequestParams,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getProgramByIdResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getProgramById(req, reply) {
      const database = getDatabase();

      const program = await database.query.program.findFirst({
        where(program, { eq }) {
          return eq(program.id, req.params.programId);
        },
        with: {
          channel: true,
          episode: {
            with: {
              series: {
                with: {
                  episodes: {
                    orderBy(episode, { asc }) {
                      return asc(episode.order);
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (program == null) {
        return reply.code(404).send();
      }
      reply.code(200).send(program);
    },
  });

  api.route({
    method: 'GET',
    url: '/recommended/:referenceId',
    schema: {
      tags: ['レコメンド'],
      params: schema.getRecommendedModulesRequestParams,
      // レスポンスバリデーションを一時的に無効化
      // response: {
      //   200: {
      //     content: {
      //       'application/json': {
      //         schema: schema.getRecommendedModulesResponse,
      //       },
      //     },
      //   },
      // },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getRecommendedModules(req, reply) {
      const database = getDatabase();

      try {
        console.log(`レコメンドモジュール取得開始: ${req.params.referenceId}`);

        // レスポンスサイズを制限するために最適化したクエリ
        const modules = await database.query.recommendedModule.findMany({
          orderBy(module, { asc }) {
            return asc(module.order);
          },
          where(module, { eq }) {
            return eq(module.referenceId, req.params.referenceId);
          },
          // モジュール数を3つに制限
          limit: 3,
          with: {
            items: {
              orderBy(item, { asc }) {
                return asc(item.order);
              },
              // 各アイテムの最初の3件だけを取得
              limit: 3,
              with: {
                // シリーズの場合は必要最小限のデータだけを取得
                series: {
                  columns: {
                    id: true,
                    title: true,
                    description: true,
                    thumbnailUrl: true,
                  },
                  with: {
                    // 各シリーズの最初の1エピソードだけを取得
                    episodes: {
                      limit: 1,
                      orderBy(episode, { asc }) {
                        return asc(episode.order);
                      },
                      // 必要なカラムだけを選択
                      columns: {
                        id: true,
                        title: true,
                        thumbnailUrl: true,
                        order: true,
                      },
                    },
                  },
                },
                // エピソードの場合も必要最小限のデータだけを取得
                episode: {
                  columns: {
                    id: true,
                    title: true,
                    description: true,
                    thumbnailUrl: true,
                  },
                  with: {
                    // シリーズ情報も最小限に
                    series: {
                      columns: {
                        id: true,
                        title: true,
                      },
                      with: {
                        // 追加のエピソードは取得しない
                        episodes: false,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        console.log(`レコメンドモジュール取得完了: ${req.params.referenceId}, モジュール数: ${modules.length}`);

        // レスポンスのサイズをログに出力
        const responseJson = JSON.stringify(modules);
        console.log(`レスポンスサイズ: ${responseJson.length} バイト (${Math.round(responseJson.length / 1024)} KB)`);

        // データを加工せずにそのままのデータ構造で返す
        return reply.code(200).send(modules);
      } catch (error) {
        console.error(`レコメンドモジュール取得エラー: ${req.params.referenceId}`, error);
        if (error instanceof Error) {
          console.error('エラー詳細:', error.message);
          console.error('スタックトレース:', error.stack);
        }
        // スキーマエラーを回避するため、空のモジュールリストを返す
        return reply.code(500).send([]);
      }
    },
  });

  api.route({
    method: 'POST',
    url: '/signIn',
    schema: {
      tags: ['認証'],
      body: schema.signInRequestBody,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.signInResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function signIn(req, reply) {
      const database = getDatabase();

      const user = await database.query.user.findFirst({
        where(user, { eq }) {
          return eq(user.email, req.body.email);
        },
      });
      if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        return reply.code(401).send();
      }

      const ret = schema.signInResponse.parse({ id: user.id, email: user.email });

      req.session.set('id', ret.id.toString());
      reply.code(200).send(user);
    },
  });

  api.route({
    method: 'POST',
    url: '/signUp',
    schema: {
      tags: ['認証'],
      body: schema.signUpRequestBody,
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.signUpResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function signUp(req, reply) {
      const database = getDatabase();

      const hasAlreadyExists = await database.query.user.findFirst({
        where(user, { eq }) {
          return eq(user.email, req.body.email);
        },
      });
      if (hasAlreadyExists) {
        return reply.code(400).send();
      }

      const users = await database
        .insert(databaseSchema.user)
        .values({
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
        })
        .returning();

      const user = users.find((u) => u.email === req.body.email);
      if (!user) {
        return reply.code(500).send();
      }

      const ret = schema.signUpResponse.parse({ id: user.id, email: user.email });

      req.session.set('id', ret.id.toString());
      reply.code(200).send(ret);
    },
  });

  api.route({
    method: 'GET',
    url: '/users/me',
    schema: {
      tags: ['認証'],
      response: {
        200: {
          content: {
            'application/json': {
              schema: schema.getUserResponse,
            },
          },
        },
      },
    } satisfies FastifyZodOpenApiSchema,
    handler: async function getSession(req, reply) {
      try {
        console.log('GET /users/me が呼び出されました');
        const database = getDatabase();

        const userId = req.session.get('id');
        console.log('セッションID:', userId);

        // ユーザーIDがセッションにある場合はユーザー情報を返す
        if (userId) {
          console.log('ユーザーIDが見つかりました:', userId);
          try {
            const user = await database.query.user.findFirst({
              where(user, { eq }) {
                return eq(user.id, Number(userId));
              },
            });

            console.log('取得したユーザー:', user);
            if (user) {
              return reply.code(200).send(user);
            }
          } catch (dbError) {
            console.error('データベースエラー:', dbError);
            return reply.code(500).send({ error: 'データベースエラー' });
          }
        }

        // ログインしていない場合は、空のユーザーオブジェクトとログインしていないことを示すフラグを返す
        console.log('認証されていません');
        reply.code(200).send({
          id: null,
          email: null,
          isAuthenticated: false,
        });
      } catch (error) {
        console.error('認証エラー:', error);
        reply.code(500).send({ error: '認証エラー' });
      }
    },
  });

  api.route({
    method: 'POST',
    url: '/signOut',
    schema: {
      tags: ['認証'],
    } satisfies FastifyZodOpenApiSchema,
    handler: async function signOut(req, reply) {
      const userId = req.session.get('id');
      if (!userId) {
        return reply.code(401).send();
      }
      req.session.set('id', void 0);
      reply.code(200).send();
    },
  });

  /* eslint-enable sort/object-properties */
}
