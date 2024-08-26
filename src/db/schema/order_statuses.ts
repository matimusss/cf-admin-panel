
////TABLA :  :  order_statuses

import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
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
export const tableName = 'order_statuses';
export const route =  'order_statuses';
export const definition = {
  id: text('id').primaryKey(),
  status_name: text('status_name').notNull(),
  color: text('color').notNull(),
  privacy: text('privacy').notNull().default('private'),
  created_by: text('created_by'),
};



export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});