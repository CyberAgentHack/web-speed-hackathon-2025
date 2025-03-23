/* eslint-disable sort/object-properties */
import '@wsh-2025/schema/src/setups/luxon';

import { relations } from 'drizzle-orm';
import { sqliteTable as table, index } from 'drizzle-orm/sqlite-core';
import * as t from 'drizzle-orm/sqlite-core';
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
const startAtTimestamp = t.customType<{
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
const endAtTimestamp = t.customType<{
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
    id: t.text().primaryKey(),
    numberOfChunks: t.integer().notNull(),
  },
  (stream) => [
    index('stream_id_idx').on(stream.id),
  ],
);

export const series = table(
  'series',
  {
    id: t.text().primaryKey(),
    description: t.text().notNull(),
    thumbnailUrl: t.text().notNull(),
    title: t.text().notNull(),
  },
  (series) => [
    index('series_id_idx').on(series.id),
  ],
);
export const seriesRelation = relations(series, ({ many }) => ({
  episodes: many(episode),
}));

export const episode = table(
  'episode',
  {
    id: t.text().primaryKey(),
    description: t.text().notNull(),
    thumbnailUrl: t.text().notNull(),
    title: t.text().notNull(),
    order: t.integer().notNull(),
    seriesId: t
      .text()
      .notNull()
      .references(() => series.id),
    streamId: t
      .text()
      .notNull()
      .references(() => stream.id),
    premium: t.integer({ mode: 'boolean' }).notNull(),
  },
  (episode) => [
    index('episode_series_id_idx').on(episode.seriesId),
    index('episode_stream_id_idx').on(episode.streamId),
    index('episode_order_idx').on(episode.order),
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
    id: t.text().primaryKey(),
    name: t.text().notNull(),
    logoUrl: t.text().notNull(),
  },
  () => [],
);

export const program = table(
  'program',
  {
    id: t.text().primaryKey(),
    title: t.text().notNull(),
    description: t.text().notNull(),
    startAt: startAtTimestamp().notNull(),
    endAt: endAtTimestamp().notNull(),
    thumbnailUrl: t.text().notNull(),
    channelId: t
      .text()
      .notNull()
      .references(() => channel.id),
    episodeId: t
      .text()
      .notNull()
      .references(() => episode.id),
  },
  (program) => [
    index('program_start_at_idx').on(program.startAt),
    index('program_end_at_idx').on(program.endAt),
    index('program_channel_id_idx').on(program.channelId),
    index('program_episode_id_idx').on(program.episodeId),
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
    id: t.text().primaryKey(),
    order: t.integer().notNull(),
    moduleId: t
      .text()
      .notNull()
      .references(() => recommendedModule.id),
    seriesId: t.text().references(() => series.id),
    episodeId: t.text().references(() => episode.id),
  },
  (item) => [
    index('rec_item_module_id_idx').on(item.moduleId),
    index('rec_item_series_id_idx').on(item.seriesId),
    index('rec_item_episode_id_idx').on(item.episodeId),
    index('rec_item_order_idx').on(item.order),
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
    id: t.text().primaryKey(),
    order: t.integer().notNull(),
    title: t.text().notNull(),
    referenceId: t.text().notNull(),
    type: t.text().notNull(),
  },
  (module) => [
    index('rec_module_reference_id_idx').on(module.referenceId),
    index('rec_module_order_idx').on(module.order),
  ],
);
export const recommendedModuleRelation = relations(recommendedModule, ({ many }) => ({
  items: many(recommendedItem),
}));

export const user = table(
  'user',
  {
    id: t.integer().primaryKey().notNull(),
    email: t.text().notNull().unique(),
    password: t.text().notNull(),
  },
  () => [],
);