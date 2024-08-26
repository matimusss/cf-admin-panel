
//////TABLA :  :  :  product_shipping_info

import { text, numeric, sqliteTable } from 'drizzle-orm/sqlite-core';
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
export const tableName = 'product_shipping_info';
export const route = 'product_shipping_info';
export const definition = {
  id: text('id').primaryKey(),
  product_id: text('product_id').references(() => products.table.id),
  weight: numeric('weight').notNull().default(0),
  weight_unit: text('weight_unit'),
  volume: numeric('volume').notNull().default(0),
  volume_unit: text('volume_unit'),
  dimension_width: numeric('dimension_width').notNull().default(0),
  dimension_height: numeric('dimension_height').notNull().default(0),
  dimension_depth: numeric('dimension_depth').notNull().default(0),
  dimension_unit: text('dimension_unit')
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