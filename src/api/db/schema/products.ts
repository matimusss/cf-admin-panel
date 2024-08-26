import { text, numeric, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import * as productCategories from './product_categories';
import * as productShippingInfo from './product_shipping_info';
import * as gallery from './gallery';
import * as productTags from './product_tags';
import * as productSuppliers from './product_suppliers';
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


export const tableName = 'products';

export const route = 'products';
export const definition = {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  product_name: text('product_name').notNull(),
  sku: text('sku'),
  sale_price: numeric('sale_price').notNull().default(0),
  compare_price: numeric('compare_price').default(0),
  buying_price: numeric('buying_price'),
  quantity: numeric('quantity').notNull().default(0),
  short_description: text('short_description').notNull(),
  product_description: text('product_description').notNull(),
  product_type: text('product_type'),
  published: numeric('published').default(0),
  disable_out_of_stock: numeric('disable_out_of_stock').default(1),
  note: text('note'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
};

export const table = sqliteTable(tableName, {
  ...definition
  ,
  ...auditSchema
});


export const relation = relations(table, ({ many, one }) => ({
  categories: many(productCategories.table, {
    fields: [table.id],
    references: [productCategories.table.product_id]
  }),
  shipping_info: many(productShippingInfo.table, {
    fields: [table.id],
    references: [productShippingInfo.table.product_id]
  }),
  gallery: many(gallery.table, {
    fields: [table.id],
    references: [gallery.table.product_id]
  }),
  tags: many(productTags.table, {
    fields: [table.id],
    references: [productTags.table.product_id]
  }),
  suppliers: many(productSuppliers.table, {
    fields: [table.id],
    references: [productSuppliers.table.product_id]
  })
}));


//se refiere a campos de la tabla  , podes especificar el tipo de form aca.

export const fields: ApiConfig['fields'] = {

  tags: {
    type: 'foreign'
  }

};

