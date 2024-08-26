import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { auditSchema } from './../audit';




import { ApiConfig } from './../routes';
import { isAdminOrEditor } from '../config-helpers';

export const tableName = 'categories';

export const route = 'categories';

export const definition = {
  id: text('id').primaryKey(),
  category_name: text('category_name'),
  category_description: text('category_description'),
  icon: text('icon'),
  image: text('image'),
  placeholder: text('placeholder'),
  active: text('active')
};






export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});



export const access: ApiConfig['access'] = {
  operation: {
    read: true,
    create: true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor
  }
};
