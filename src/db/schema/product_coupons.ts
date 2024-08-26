

import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';
import * as coupons from './coupons';
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
export const tableName = 'product_coupons';
export const route =   'product_coupons';
export const definition = {
  id: text('id').primaryKey(),
  product_id: text('product_id').references(() => products.table.id).notNull(),
  coupon_id: text('coupon_id').references(() => coupons.table.id).notNull()
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
  coupon: one(coupons.table, {
    fields: [table.coupon_id],
    references: [coupons.table.id]
  })
}));