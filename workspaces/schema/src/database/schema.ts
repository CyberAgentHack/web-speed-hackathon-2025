/* eslint-disable sort/object-properties */

import { relations } from 'drizzle-orm';
import { sqliteTable as table } from 'drizzle-orm/sqlite-core';
import * as t from 'drizzle-orm/sqlite-core';

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
const startAtTimestamp = t.customType<{
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
const endAtTimestamp = t.customType<{
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
    id: t.text().primaryKey(),
    numberOfChunks: t.integer().notNull(),
  },
  () => [],
);

export const series = table(
  'series',
  {
    id: t.text().primaryKey(),
    description: t.text().notNull(),
    thumbnailUrl: t.text().notNull(),
    title: t.text().notNull(),
  },
  () => [],
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
    id: t.text().primaryKey(),
    order: t.integer().notNull(),
    moduleId: t
      .text()
      .notNull()
      .references(() => recommendedModule.id),
    seriesId: t.text().references(() => series.id),
    episodeId: t.text().references(() => episode.id),
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
    id: t.text().primaryKey(),
    order: t.integer().notNull(),
    title: t.text().notNull(),
    referenceId: t.text().notNull(),
    type: t.text().notNull(),
  },
  () => [],
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
