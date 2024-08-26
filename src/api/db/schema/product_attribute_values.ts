
////TABLA :  :  product_attribute_values

import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as productAttributes from './product_attributes';
import * as attributeValues from './attribute_values';
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
export const tableName = 'product_attribute_values';
export const route = 'product_attribute_values';
export const definition = {
  id: text('id').primaryKey(),
  product_attribute_id: text('product_attribute_id').references(() => productAttributes.table.id).notNull(),
  attribute_value_id: text('attribute_value_id').references(() => attributeValues.table.id).notNull()
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});


export const relation = relations(table, ({ one }) => ({
  productAttribute: one(productAttributes.table, {
    fields: [table.product_attribute_id],
    references: [productAttributes.table.id]
  }),
  attributeValue: one(attributeValues.table, {
    fields: [table.attribute_value_id],
    references: [attributeValues.table.id]
  })
}));