/* eslint-disable sort/object-properties */
import '@wsh-2025/schema/src/setups/luxon';

import { relations } from 'drizzle-orm';
import { customType, index, integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';
import { DateTime } from 'luxon';

function parseTime(timeString: string): DateTime {
  const parsed = DateTime.fromFormat(timeString, 'HH:mm:ss').toObject();
  return DateTime.now().set({
    hour: parsed.hour,
    minute: parsed.minute,
    second: parsed.second,
    millisecond: 0,
  });
}

function formatTime(isoString: string): string {
  return DateTime.fromISO(isoString).toFormat('HH:mm:ss');
}

// 競技のため、時刻のみ保持して、日付は現在の日付にします
const startAtTimestamp = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'text';
  },
  fromDriver(timeString: string) {
    return parseTime(timeString).toISO();
  },
  toDriver(isoString: string) {
    return formatTime(isoString);
  },
});

// 競技のため、時刻のみ保持して、日付は現在の日付にします
// 放送終了時刻が 00:00:00 の場合は、翌日の 00:00:00 にします
const endAtTimestamp = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'text';
  },
  fromDriver(timeString: string) {
    const parsed = parseTime(timeString);
    if (DateTime.now().startOf('day').equals(parsed)) {
      return parsed.plus({ day: 1 }).toISO();
    }
    return parsed.toISO();
  },
  toDriver(isoString: string) {
    return formatTime(isoString);
  },
});

export const stream = table(
  'stream',
  {
    id: text().primaryKey(),
    numberOfChunks: integer().notNull(),
  },
  () => [],
);

export const series = table(
  'series',
  {
    id: text().primaryKey(),
    description: text().notNull(),
    thumbnailUrl: text().notNull(),
    title: text().notNull(),
  },
  () => [],
);
export const seriesRelation = relations(series, ({ many }) => ({
  episodes: many(episode),
}));

export const episode = table(
  'episode',
  {
    id: text().primaryKey(),
    description: text().notNull(),
    thumbnailUrl: text().notNull(),
    title: text().notNull(),
    order: integer().notNull(),
    seriesId: text()
      .notNull()
      .references(() => series.id),
    streamId: text()
      .notNull()
      .references(() => stream.id),
    premium: integer({ mode: 'boolean' }).notNull(),
  },
  (t) => [
    index("idx_episode_seriesId").on(t.seriesId),
    index("idx_episode_streamId").on(t.streamId),
  ],
);
export const episodeRelation = relations(episode, ({ one }) => ({
  series: one(series, {
    fields: [episode.seriesId],
    references: [series.id],
  }),
  stream: one(stream, {
    fields: [episode.streamId],
    references: [stream.id],
  }),
}));

export const channel = table(
  'channel',
  {
    id: text().primaryKey(),
    name: text().notNull(),
    logoUrl: text().notNull(),
  },
  () => [],
);

export const program = table(
  'program',
  {
    id: text().primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    startAt: startAtTimestamp().notNull(),
    endAt: endAtTimestamp().notNull(),
    thumbnailUrl: text().notNull(),
    channelId: text()
      .notNull()
      .references(() => channel.id),
    episodeId: text()
      .notNull()
      .references(() => episode.id),
  },
  (t) => [
    index("idx_program_channelId").on(t.channelId),
    index("idx_program_episodeId").on(t.episodeId),
  ],
);
export const programRelation = relations(program, ({ one }) => ({
  channel: one(channel, {
    fields: [program.channelId],
    references: [channel.id],
  }),
  episode: one(episode, {
    fields: [program.episodeId],
    references: [episode.id],
  }),
}));

export const recommendedItem = table(
  'recommendedItem',
  {
    id: text().primaryKey(),
    order: integer().notNull(),
    moduleId: text()
      .notNull()
      .references(() => recommendedModule.id),
    seriesId: text().references(() => series.id),
    episodeId: text().references(() => episode.id),
  },
  (t) => [
    index("idx_recommendedItem_moduleId").on(t.moduleId),
    index("idx_recommendedItem_seriesId").on(t.seriesId),
    index("idx_recommendedItem_episodeId").on(t.episodeId),
  ],
);
export const recommendedItemRelation = relations(recommendedItem, ({ one }) => ({
  module: one(recommendedModule, {
    fields: [recommendedItem.moduleId],
    references: [recommendedModule.id],
  }),
  series: one(series, {
    fields: [recommendedItem.seriesId],
    references: [series.id],
  }),
  episode: one(episode, {
    fields: [recommendedItem.episodeId],
    references: [episode.id],
  }),
}));

export const recommendedModule = table(
  'recommendedModule',
  {
    id: text().primaryKey(),
    order: integer().notNull(),
    title: text().notNull(),
    referenceId: text().notNull(),
    type: text().notNull(),
  },
  (t) => [
    index("idx_recommendedModule_referenceId").on(t.referenceId),
  ],
);
export const recommendedModuleRelation = relations(recommendedModule, ({ many }) => ({
  items: many(recommendedItem),
}));

export const user = table(
  'user',
  {
    id: integer().primaryKey().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
  },
  () => [],
);
