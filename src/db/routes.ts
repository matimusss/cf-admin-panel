import * as users from './schema/users';
import * as posts from './schema/posts';
import * as comments from './schema/comments';
import * as userKeys from './schema/userKeys';
import * as userSessions from './schema/userSessions';
import * as pages from './schema/pages';
import * as assets from './schema/assets';
import { AppContext } from '..';
import { isAdminOrEditor } from './config-helpers';


import * as attribute_values from './schema/attribute_values';  
import * as attributes from './schema/attributes';
import * as countries from './schema/countries';
import * as coupons from './schema/coupons';
import * as gallery from './schema/gallery';
import * as notifications from './schema/notifications';
import * as order_items from './schema/order_items';
import * as order_statuses from './schema/order_statuses';
import * as orders from './schema/orders';
import * as product_attribute_values from './schema/product_attribute_values';
import * as product_attributes from './schema/product_attributes';
import * as product_categories from './schema/product_categories';
import * as product_coupons from './schema/product_coupons';
import * as product_shipping_info from './schema/product_shipping_info';
import * as product_suppliers from './schema/product_suppliers';
import * as product_tags from './schema/product_tags';
import * as products from './schema/products';
import * as sells from './schema/sells';
import * as shipping_country_zones from './schema/shipping_country_zones';
import * as shipping_rates from './schema/shipping_rates';
import * as shipping_zones from './schema/shipping_zones';
import * as suppliers from './schema/suppliers';
import * as tags from './schema/tags';
import * as variant_options from './schema/variant_options';
import * as variant_values from './schema/variant_values';
import * as variants from './schema/variants';
import * as categories from './schema/categories';




export type SonicJSConfig = {
  apiConfig: ApiConfig[];
  adminAccessControl: (ctx: AppContext) => boolean;
};
export type SonicJSFilter = Record<string, any>;
export interface ApiConfig {
  table: string;
  route: string;
  // Access control if auth is enabled
  // ctx: HonoContext, contains all the information about the request
  // id: the id of the document the operation is being performed on, could be undefined if reading multiple rows
  // data: the data passed to the operation
  // doc: the document being requested/updated/deleted
  // Get the user: ctx.get("user")
  // Get the session: ctx.get("session")
  // By default, operations are always allowed.
  // false will result in a 403 UNAUTHORIZED response.
  access?: {
    // Each operation that can be performed has access control.
    // Operations can be a boolean or a function (async or not) that returns a boolean.
    operation?: {
      // Determines if creating a new document in the table is allowed.
      create?:
        | boolean
        | ((ctx?: AppContext, data?: any) => boolean | Promise<boolean>);
      // Determines if reading a document from the table is allowed.
      read?:
        | boolean
        | ((ctx?: AppContext, id?: string) => boolean | Promise<boolean>);
      // Determines if updating a document in the table is allowed.
      update?:
        | boolean
        | ((
            ctx?: AppContext,
            id?: string,
            data?: any
          ) => boolean | Promise<boolean>);
      // Determines if deleting a document from the table is allowed.
      delete?:
        | boolean
        | ((ctx: AppContext, id: string) => boolean | Promise<boolean>);
    };
    // Defines the access control for filtering documents in the table based on certain conditions.
    // If a filter is returned the filter will be added to the operation.
    // Perhaps the read will return no/different data and the update/delete will not be performed.
    // Can also return a pboolean in which case it acts the same as operation
    filter?: {
      read?:
        | SonicJSFilter
        | ((
            ctx?: AppContext,
            id?: string
          ) => SonicJSFilter | Promise<SonicJSFilter>)
        | boolean
        | ((ctx: AppContext, id: string) => boolean | Promise<boolean>);
      update?:
        | SonicJSFilter
        | ((
            ctx?: AppContext,
            id?: string,
            data?: any
          ) => SonicJSFilter | Promise<SonicJSFilter>)
        | boolean
        | ((
            ctx?: AppContext,
            id?: string,
            data?: any
          ) => boolean | Promise<boolean>);
      delete?:
        | SonicJSFilter
        | ((
            ctx?: AppContext,
            id?: string
          ) => SonicJSFilter | Promise<SonicJSFilter>)
        | boolean
        | ((ctx?: AppContext, id?: string) => boolean | Promise<boolean>);
    };
    // More powerful but also less performant access control because the doc being requested/updated/deleted is read passed in.
    // This allows more complex access control based on the document the action is being performed on.
    item?: {
      read?:
        | boolean
        | ((
            ctx?: AppContext,
            id?: string,
            doc?: any
          ) => boolean | Promise<boolean>);
      update?:
        | boolean
        | ((
            ctx?: AppContext,
            id?: string,
            data?: any,
            doc?: any
          ) => boolean | Promise<boolean>);
      delete?:
        | boolean
        | ((
            ctx?: AppContext,
            id?: string,
            doc?: any
          ) => boolean | Promise<boolean>);
    };
    // Defines the access control for each field in the table.
    // Read – applied when the field is selected through any operation
    // * true - The field will be returned in the response
    // * false - The field will be null in the response
    // Create - applied when creating a new document
    // * true - The field will be passed on to the create operation
    // * false - The field will be discarded and omitted from the create operation
    // Update - applied when updating a document
    // * true - The field will be passed on to the update operation
    // * false - The field will be discarded and omitted from the update operation
    fields?: {
      [field: string]: {
        // Returns a boolean which allows or denies the ability to set a field's value when creating a new document. If false is returned, any passed values will be discarded.
        create?:
          | boolean
          | ((ctx?: AppContext, data?: any) => boolean | Promise<boolean>);
        //Returns a boolean which allows or denies the ability to read a field's value. If false, the entire property is omitted from the resulting document.
        read?:
          | boolean
          | ((
              ctx?: AppContext,
              value?: string,
              doc?: any
            ) => boolean | Promise<boolean>);
        // Returns a boolean which allows or denies the ability to update a field's value. If false is returned, any passed values will be discarded.
        // If false is returned and you attempt to update the field's value, the operation will not throw an error however the field will be omitted from the update operation and the value will remain unchanged.
        update?:
          | boolean
          | ((
              ctx?: AppContext,
              id?: string,
              data?: any
            ) => boolean | Promise<boolean>);
      };
    };
  };
  hooks?: {
    resolveInput?: {
      create?: (ctx: AppContext, data: any) => any | Promise<any>;
      update?: (ctx: AppContext, id: string, data: any) => any | Promise<any>;
    };
    beforeOperation?: (
      ctx: AppContext,
      operation: 'create' | 'read' | 'update' | 'delete',
      id?: string,
      data?: any
    ) => void | Promise<void>;
    afterOperation?: (
      ctx: AppContext,
      operation: 'create' | 'read' | 'update' | 'delete',
      id?: string,
      data?: any,
      result?: { data?: any } & Record<string, any>
    ) => void | Promise<void>;
  };
  fields?: {
    [field: string]:
      | {
          type: 'auto' | 'string[]';
        }
      | {
          type: 'file' | 'file[]';
          bucket: (ctx: AppContext) => R2Bucket;
          path?: string | ((ctx: AppContext) => string);
        }
      | {
          type: 'password';
        }
        | {
          type: 'foreign';
        }
      | {
          type: 'ckeditor';
        }
      | {
          type: 'quill';
        };
        

        
    //aca agregariamos NUEVO CAMPO FORMIO
  };
}

export const apiConfig: ApiConfig[] = [];

export const tableSchemas = {
  users,
  posts,
  comments,
  categories,
  userKeys,
  userSessions,
  pages,
  assets,
  attribute_values,
attributes,
countries,
coupons,
gallery,
notifications,
order_items,
order_statuses,
orders,
product_attribute_values,
product_attributes,
product_categories,
product_coupons,
product_shipping_info,
product_suppliers,
product_tags,
products,
sells,
shipping_country_zones,
shipping_rates,
shipping_zones,
suppliers,
tags,
variant_options,
variant_values,
variants,
};

for (const key of Object.keys(tableSchemas)) {
  const table = tableSchemas[key];
  if (table.route) {
    apiConfig.push({
      table: table.tableName,
      route: table.route,
      access: table.access,
      hooks: table.hooks,
      fields: table.fields
    });
  }
}
//asd
export const config: SonicJSConfig = {
  apiConfig: apiConfig,
  adminAccessControl: isAdminOrEditor
};
