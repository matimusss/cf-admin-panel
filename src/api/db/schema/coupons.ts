import { text, numeric, sqliteTable } from 'drizzle-orm/sqlite-core';
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

export const tableName = 'coupons';

export const route = 'coupons';
export const definition = {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  discount_value: numeric('discount_value'),
  discount_type: text('discount_type').notNull(),
  times_used: numeric('times_used').notNull().default(0),
  max_usage: numeric('max_usage'),
  order_amount_limit: numeric('order_amount_limit'),
  coupon_start_date: text('coupon_start_date'), // Adjust type as per actual date type in SQLite
  coupon_end_date: text('coupon_end_date'), // Adjust type as per actual date type in SQLite
  created_by: text('created_by'),
  updated_by: text('updated_by')
};















export const table = sqliteTable(tableName, {
  ...definition
  ,
  ...auditSchema
});
