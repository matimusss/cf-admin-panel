////TABLA :  :  product_categories

import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';
import * as categories from './categories';
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

export const tableName = 'product_categories';
export const route = 'product_categories';
export const definition = {
  id: text('id').primaryKey(),
  product_id: text('product_id').references(() => products.table.id).notNull(),
  category_id: text('category_id').references(() => categories.table.id).notNull()
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
  category: one(categories.table, {
    fields: [table.category_id],
    references: [categories.table.id]
  })
}));