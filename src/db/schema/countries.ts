import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
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
export const tableName = 'countries';
export const route =   'countries';
export const definition = {
  id: integer('id').primaryKey(),
  iso: text('iso').notNull(),
  name: text('name').notNull(),
  upper_name: text('upper_name').notNull(),
  iso3: text('iso3'),
  num_code: integer('num_code'),
  phone_code: integer('phone_code').notNull()
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});
