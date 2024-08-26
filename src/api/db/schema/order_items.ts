
////TABLA :  :  order_items

import { text, numeric, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';
import * as orders from './orders';
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
export const tableName = 'order_items';
export const route =  'order_items';
export const definition = {
  id: text('id').primaryKey(),
  product_id: text('product_id').references(() => products.table.id),
  order_id: text('order_id').references(() => orders.table.id),
  price: numeric('price').notNull(),
  quantity: numeric('quantity').notNull()
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
  order: one(orders.table, {
    fields: [table.order_id],
    references: [orders.table.id]
  })
}));