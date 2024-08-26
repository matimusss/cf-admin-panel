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
export const tableName = 'attributes';
export const route= 'attributes';
export const definition = {
  id: text('id').primaryKey(),
  attribute_name: text('attribute_name').notNull()
};

export const table = sqliteTable(tableName, {
  ...definition
  ,
  ...auditSchema
});
