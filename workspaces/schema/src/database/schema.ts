/* eslint-disable sort/object-properties */

import { relations } from 'drizzle-orm';
import { customType, integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

function parseTime(timeString: string): Date {
  const parts = timeString.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  const seconds = parts[2] || 0;
  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);
  return now;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const timeParts = date.toTimeString().split(' ');
  return timeParts[0] || '00:00:00';
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
    return parseTime(timeString).toISOString();
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
    // 00:00:00の場合は翌日の00:00:00にする
    if (parsed.getHours() === 0 && parsed.getMinutes() === 0 && parsed.getSeconds() === 0) {
      parsed.setDate(parsed.getDate() + 1);
    }
    return parsed.toISOString();
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
  () => [],
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
  () => [],
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
  () => [],
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
  () => [],
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
