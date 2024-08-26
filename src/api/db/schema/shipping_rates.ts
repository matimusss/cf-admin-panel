
////TABLA :  :  shipping_rates

import { text, numeric,  sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as shippingZones from './shipping_zones';
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
export const tableName = 'shipping_rates';
export const route =  'shipping_rates';

export const definition = {
  id: text('id').primaryKey(),
  shipping_zone_id: numeric('shipping_zone_id').references(() => shippingZones.table.id).notNull(),
  weight_unit: text('weight_unit'),
  min_value: numeric('min_value').notNull(),
  max_value: numeric('max_value'),
  no_max: text('no_max'),
  price: numeric('price').notNull(),

};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

export const relation = relations(table, ({ one }) => ({
  shippingZone: one(shippingZones.table, {
    fields: [table.shipping_zone_id],
    references: [shippingZones.table.id]
  })
}));