import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
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

export const tableName = 'suppliers';
export const route = 'suppliers';
export const definition = {
  id: text('id').primaryKey(),
  supplier_name: text('supplier_name').notNull(),
  company: text('company'),
  phone_number: text('phone_number'),
  address_line1: text('address_line1').notNull(),
  address_line2: text('address_line2'),
  country_id: integer('country_id'),
  city: text('city'),
  note: text('note'),
  created_by: text('created_by'),
  updated_by: text('updated_by')
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

