
////TABLA :  :  gallery

import { text,  sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';
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
export const tableName = 'gallery';
export const route = 'gallery';
export const definition = {
  id: text('id').primaryKey(),
  product_id: text('product_id').references(() => products.table.id),
  image: text('image').notNull(),
  placeholder: text('placeholder'),
  is_thumbnail:  text('is_thumbnail'),
};




export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});


export const relation = relations(table, ({ one }) => ({
  product: one(products.table, {
    fields: [table.product_id],
    references: [products.table.id]
  })
}));