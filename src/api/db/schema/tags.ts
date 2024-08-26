


////TABLA :  :  tags

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




export const tableName = 'tags';
export const route =  'tags';


export const definition = {
  id: text('id').primaryKey(),
  tag_name: text('tag_name').notNull(),
  icon: text('icon').notNull()
  
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

