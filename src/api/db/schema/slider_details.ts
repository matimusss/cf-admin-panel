

////TABLA :  :  slider_details

import { text, numeric, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as slideshows from './slideshows';

export const tableName = 'slider_details';

export const definition = {
  id: text('id').primaryKey(),
  slideshow_id: text('slideshow_id').references(() => slideshows.table.id).notNull(),
  content: text('content').notNull(),
  display_order: numeric('display_order').notNull()
};

export const table = sqliteTable(tableName, {
  ...definition
});

export const relation = relations(table, ({ one }) => ({
  slideshow: one(slideshows.table, {
    fields: [table.slideshow_id],
    references: [slideshows.table.id]
  })
}));


