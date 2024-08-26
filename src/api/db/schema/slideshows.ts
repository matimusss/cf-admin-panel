
////TABLA :  :  slideshows

import { text,  numeric, sqliteTable } from 'drizzle-orm/sqlite-core';
import { auditSchema } from './audit';



import { ApiConfig } from '../routes';


export const access: ApiConfig['access'] = {
  operation: {
    read: true,
    create: true,
    update: true,
    delete: true
  }
};
export const tableName = 'slideshows';
export const route =  'slideshows';
export const definition = {
  id: text('id').primaryKey(),
  title: text('title'),
  destination_url: text('destination_url'),
  image: text('image').notNull(),
  placeholder: text('placeholder').notNull(),
  description: text('description'),
  btn_label: text('btn_label'),
  display_order: numeric('display_order').notNull(),
  published: text('published'),
  clicks: numeric('clicks').notNull().default(0),
  styles: text('styles'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull()
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});
