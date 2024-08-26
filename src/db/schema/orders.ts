
////TABLA :  :  orders

import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as users from './users';
import * as orderStatuses from './order_statuses';
import * as coupons from './coupons';
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
export const tableName = 'orders';
export const route =  'orders';
export const definition = {
  id: text('id').primaryKey(),
  coupon_id: text('coupon_id').references(() => coupons.table.id),
  customer_id: text('customer_id').references(() => users.table.id),
  order_status_id: text('order_status_id').references(() => orderStatuses.table.id),
  order_approved_at: text('order_approved_at'),
  order_delivered_carrier_date: text('order_delivered_carrier_date'),
  order_delivered_customer_date: text('order_delivered_customer_date'),
  updated_by: text('updated_by')
};












export const table = sqliteTable(tableName, {
  ...definition
  ,
  ...auditSchema
});

export const relation = relations(table, ({ one }) => ({
  customer: one(users.table, {
    fields: [table.customer_id],
    references: [users.table.id]
  }),
  orderStatus: one(orderStatuses.table, {
    fields: [table.order_status_id],
    references: [orderStatuses.table.id]
  }),
  coupon: one(coupons.table, {
    fields: [table.coupon_id],
    references: [coupons.table.id]
  })
}));