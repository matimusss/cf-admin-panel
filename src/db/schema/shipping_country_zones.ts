
////TABLA :  :  shipping_country_zones

import { text, numeric, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as shippingZones from './shipping_zones';
import * as countries from './countries';
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
export const tableName = 'shipping_country_zones';
export const route =  'shipping_country_zones';
export const definition = {
  id: text('id').primaryKey(),
  shipping_zone_id: numeric('shipping_zone_id').references(() => shippingZones.table.id).notNull(),
  country_id: numeric('country_id').references(() => countries.table.id).notNull()
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

export const relation = relations(table, ({ one }) => ({
  shippingZone: one(shippingZones.table, {
    fields: [table.shipping_zone_id],
    references: [shippingZones.table.id]
  }),
  country: one(countries.table, {
    fields: [table.country_id],
    references: [countries.table.id]
  })
}));