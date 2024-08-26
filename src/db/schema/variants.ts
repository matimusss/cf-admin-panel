
////TABLA :  :  variants

import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';
import * as variantOptions from './variant_options';
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
export const tableName = 'variants';
export const route =  'variants';
export const definition = {
  id: text('id').primaryKey(),
  variant_option: text('variant_option'),
  product_id: text('product_id').references(() => products.table.id).notNull(),
  variant_option_id: text('variant_option_id').references(() => variantOptions.table.id).notNull(), 
};




export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});


export const relation = relations(table, ({ one }) => ({
  product_id: one(products.table, {
    fields: [table.product_id],
    references: [products.table.id]
  }),

  variant_option_id: one(variantOptions.table, {
    fields: [table.variant_option_id],
    references: [variantOptions.table.id]
  })

}));