import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as variants from './variants';
import * as productAttributeValues from './product_attribute_values';
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

export const tableName = 'variant_values';
export const route = 'variant_values';

export const definition = {
  id: text('id').primaryKey(),
  variant_id: text('variant_id').references(() => variants.table.id).notNull(),
  product_attribute_value_id: text('product_attribute_value_id').references(() => productAttributeValues.table.id).notNull()
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

export const relation = relations(table, ({ one }) => ({
  variant: one(variants.table, {
    fields: [table.variant_id],
    references: [variants.table.id]
  }),
  productAttributeValue: one(productAttributeValues.table, {
    fields: [table.product_attribute_value_id],
    references: [productAttributeValues.table.id]
  })
}));
