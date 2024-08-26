
////TABLA :  :  sells

import { text, numeric, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';



import { ApiConfig } from './../../routes';


export const access: ApiConfig['access'] = {
  operation: {
    read: true,
    create: true,
    update: true,
    delete: true
  }
};

export const tableName = 'sells';
export const route =  'sells';
export const definition = {
  id: numeric('id').primaryKey(),
  product_id: text('product_id').references(() => products.table.id).unique(),
  price: numeric('price').notNull(),
  quantity: numeric('quantity').notNull()
};

export const table = sqliteTable(tableName, {
  ...definition
});

export const relation = relations(table, ({ one }) => ({
  product: one(products.table, {
    fields: [table.product_id],
    references: [products.table.id]
  })
}));
