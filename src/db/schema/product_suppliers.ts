import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as products from './products';
import * as suppliers from './suppliers';
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
export const tableName = 'product_suppliers';

export const route = 'product_suppliers';
export const definition = {
  product_id: text('product_id').references(() => products.table.id).notNull(),
  supplier_id: text('supplier_id').references(() => suppliers.table.id).notNull(),
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
  supplier: one(suppliers.table, {
    fields: [table.supplier_id],
    references: [suppliers.table.id]
  })
}));
