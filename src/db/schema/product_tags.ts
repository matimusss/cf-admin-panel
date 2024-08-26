



////TABLA :  :  product_tags

import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';
import * as tags from './tags';


import { auditSchema } from './../audit';



import { ApiConfig } from './../routes';



export const access: ApiConfig['access'] = {
  operation: {
    read: true,
    create: true,
    update: true,
    delete: true
  }
};

export const tableName = 'product_tags';
export const route =  'product_tags';
export const definition = {
  product_id: text('product_id').references(() => products.table.id).notNull(),
  tag_id: text('tag_id').references(() => tags.table.id).notNull()
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

export const relation = relations(table, ({ one }) => ({
  product: one(products.table, {
    fields: [table.product_id],
    references: [products.table.id]
  }),
  tag: one(tags.table, {
    fields: [table.tag_id],
    references: [tags.table.id]
  })
}));