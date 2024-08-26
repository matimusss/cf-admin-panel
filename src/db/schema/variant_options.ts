
////TABLA :  :  variant_options

import { text, numeric,  sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';
import * as gallery from './gallery';
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
export const tableName = 'variant_options';
export const route =  'variant_options';
export const definition = {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  image_id: text('image_id').references(() => gallery.table.id),
  product_id: text('product_id').references(() => products.table.id).notNull(),
  sale_price: numeric('sale_price').notNull(),
  compare_price: numeric('compare_price'),
  buying_price: numeric('buying_price'),
  quantity: numeric('quantity').notNull(),
  sku: text('sku'),
  active: text('active')
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
  image: one(gallery.table, {
    fields: [table.image_id],
    references: [gallery.table.id],
  })
}));