import { drizzle } from 'drizzle-orm/d1';
import { and, eq, mapColumnsInAliasedSQLToAlias, param, ViewBaseConfig } from 'drizzle-orm';
import { tableSchemas } from '../db/routes';
import { getOperationDeleteResult } from '../auth/auth-helpers';
import { convertUint8ArrayToHex, validateScryptHash } from 'lucia/dist/utils/crypto';
import { createFilterOptions, getButtonBaseUtilityClass, tableHeadClasses } from '@mui/material';
import { isFirstDayOfMonth, secondsInQuarter, weeksToDays } from 'date-fns';
import { serial, ViewBuilderCore } from 'drizzle-orm/mysql-core';
import { CognitoUserAuth } from '@lucia-auth/oauth/providers';
import { defaultConfigOptions } from 'swr/dist/_internal';
import { validateLuciaPasswordHash } from 'lucia/utils';
import { createLuciaUser } from '../util/testing';
import { yellow } from '@mui/material/colors';
import { loadNewContent } from '../admin/pages/content';
var qs = require('qs');
//  ENDPOINTS MIOS:

export async function getProductMinDetails(db, table) {
  // Asegúrate de que el nombre de la tabla sea seguro y válido


  // Define la consulta SQL para seleccionar todos los registros de la tabla especificada
  const sql = `SELECT * FROM ${table}`;

  try {
    // Prepara y ejecuta la consulta SQL sin parámetros
    const { results } = await db.prepare(sql).all();
    return results; // Devuelve los resultados de la consulta
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error; // Lanza el error para que pueda ser manejado en el llamador
  }
}



export async function getProduct(db, id) {
  const productQuery = `
SELECT 
    p.id AS product_id,
    p.slug,
    p.product_name,
    p.sku,
    p.sale_price,
    p.compare_price,
    p.buying_price,
    p.quantity,
    p.short_description,
    p.product_description,
    p.product_type,
    json_group_array(
        DISTINCT json_object(
            'p_attribute_id', pa.id,
            'p_attribute_value_id', pav.id,
            'attribute_id', a.id,
            'attribute_name', a.attribute_name,
            'attribute_value_id', av.id,
            'attribute_value', av.attribute_value
        )
    ) AS product_attributes,
    json_group_array(
        DISTINCT json_object(
            'tag_id', t.id,
            'tag_name', t.tag_name,
            'tag_icon', t.icon
        )
    ) AS tags,
    json_group_array(
        DISTINCT json_object(
            'cat_id', ct.id,
            'cat_name', ct.category_name
        )
    ) AS categories,
    json_group_array(
        DISTINCT json_object(
            'p_coupon_id', p_co.id,
            'coupon_id', cd.id,        
            'code', cd.code,
            'discount_value', cd.discount_value,
            'discount_type', cd.discount_type
        )
    ) AS coupons,
    json_group_array(
        DISTINCT json_object(
            'gallery_id', ga.id,
            'image', ga.image,
            'placeholder', ga.placeholder,
            'is_thumb', ga.is_thumbnail
        )
    ) AS product_images,
    json_group_array(
        DISTINCT json_object(
            'supplier_id', sp.id,
            'supplier_name', sp.supplier_name
        )
    ) AS suppliers,
    (SELECT json_group_array(json_result)
     FROM (
        SELECT DISTINCT json_object(
            'variant_id', v.id,  
            'variant_option', v.variant_option,  
            'variant_title', vo.title,  
            'variant_option_id', vo.id,              
            'variant_image_id', vo.image_id,  
            'variant_sale_price', vo.sale_price,  
            'variant_compare_price', vo.compare_price,  
            'variant_buying_price', vo.buying_price, 
            'variant_quantity', vo.quantity,
            'variant_active', vo.active, 
            'variant_attributes', 
            json_group_array(
                DISTINCT json_object(
                    'p_variant_attribute_id', pa.id,
                    'p_variant_attribute_value_id', av_pattr.id,
                    'variant_attribute_name_id', av_attr.id,
                    'variant_attribute_name', av_attr.attribute_name,
                    'variant_attribute_value_id', avv.id,
                    'variant_attribute_value', avv.attribute_value
                    )
            )
        ) json_result
        FROM variants v
        LEFT JOIN variant_options vo ON v.variant_option_id = vo.id
        LEFT JOIN variant_values vv ON v.id = vv.variant_id
        LEFT JOIN product_attribute_values pavv ON vv.product_attribute_value_id = pavv.id
        LEFT JOIN attribute_values avv ON pavv.attribute_value_id = avv.id
        LEFT JOIN product_attributes av_pattr ON pavv.product_attribute_id = av_pattr.id
        LEFT JOIN attributes av_attr ON av_pattr.attribute_id = av_attr.id
        WHERE v.product_id = p.id
        GROUP BY v.variant_option, vo.title, vo.image_id, vo.sale_price, vo.compare_price, vo.buying_price, vo.quantity, vo.active
    )) AS variant_details
FROM products p
LEFT JOIN product_attributes pa ON p.id = pa.product_id
LEFT JOIN attributes a ON pa.attribute_id = a.id
LEFT JOIN product_attribute_values pav ON pa.id = pav.product_attribute_id
LEFT JOIN attribute_values av ON pav.attribute_value_id = av.id
LEFT JOIN product_coupons p_co ON p.id = p_co.product_id
LEFT JOIN coupons cd ON p_co.coupon_id = cd.id
LEFT JOIN gallery ga ON p.id = ga.product_id
LEFT JOIN product_suppliers p_su ON p.id = p_su.product_id
LEFT JOIN suppliers sp ON p_su.supplier_id = sp.id
LEFT JOIN product_tags pt ON p.id = pt.product_id
LEFT JOIN tags t ON pt.tag_id = t.id
LEFT JOIN product_categories pct ON p.id = pct.product_id
LEFT JOIN categories ct ON pct.category_id = ct.id
WHERE p.id = ?
GROUP BY p.id;
`;
try {
  // Prepara y ejecuta la consulta SQL con el parámetro proporcionado
  const { results } = await db.prepare(productQuery).bind(id).all();
  return results; // Devuelve los resultados de la consulta
} catch (error) {
  console.error('Error executing SQL:', error);
  throw error; // Lanza el error para que pueda ser manejado en el llamador
}
}







export async function getProductBySlug(db, id) {
    const productQuery = `
SELECT 
    p.id AS product_id,
    p.slug,
    p.product_name,
    p.sku,
    p.sale_price,
    p.compare_price,
    p.buying_price,
    p.quantity,
    p.short_description,
    p.product_description,
    p.product_type,
    json_group_array(
        DISTINCT json_object(
            'attribute_name', a.attribute_name,
            'attribute_value', av.attribute_value
        )
    ) AS product_attributes,
    json_group_array(
        DISTINCT json_object(
            'tag_name', t.tag_name,
            'tag_icon', t.icon
        )
    ) AS tags,
    json_group_array(
        DISTINCT json_object(
            'code', cd.code,
            'discount_value', cd.discount_value,
            'discount_type', cd.discount_type
        )
    ) AS coupons,
    json_group_array(
        DISTINCT json_object(
            'image', ga.image,
            'placeholder', ga.placeholder,
            'is_thumb', ga.is_thumbnail
        )
    ) AS product_images,
    json_group_array(
        DISTINCT json_object(
            'supplier_name', sp.supplier_name
        )
    ) AS suppliers,
    (SELECT json_group_array(json_result)
     FROM (
        SELECT DISTINCT json_object(
            'variant_option', v.variant_option,  
            'variant_title', vo.title,  
            'variant_image_id', vo.image_id,  
            'variant_sale_price', vo.sale_price,  
            'variant_compare_price', vo.compare_price,  
            'variant_buying_price', vo.buying_price, 
            'variant_quantity', vo.quantity,
            'variant_active', vo.active, 
            'variant_attributes', 
            json_group_array(
                DISTINCT json_object(
                    'variant_attribute_name', av_attr.attribute_name,
                    'variant_attribute_value', avv.attribute_value
                )
            )
        ) json_result
        FROM variants v
        LEFT JOIN variant_options vo ON v.variant_option_id = vo.id
        LEFT JOIN variant_values vv ON v.id = vv.variant_id
        LEFT JOIN product_attribute_values pavv ON vv.product_attribute_value_id = pavv.id
        LEFT JOIN attribute_values avv ON pavv.attribute_value_id = avv.id
        LEFT JOIN product_attributes av_pattr ON pavv.product_attribute_id = av_pattr.id
        LEFT JOIN attributes av_attr ON av_pattr.attribute_id = av_attr.id
        WHERE v.product_id = p.id
        GROUP BY v.variant_option, vo.title, vo.image_id, vo.sale_price, vo.compare_price, vo.buying_price, vo.quantity, vo.active
    )) AS variant_details
FROM products p
LEFT JOIN product_attributes pa ON p.id = pa.product_id
LEFT JOIN attributes a ON pa.attribute_id = a.id
LEFT JOIN product_attribute_values pav ON pa.id = pav.product_attribute_id
LEFT JOIN attribute_values av ON pav.attribute_value_id = av.id
LEFT JOIN product_coupons p_co ON p.id = p_co.product_id
LEFT JOIN coupons cd ON p_co.coupon_id = cd.id
LEFT JOIN gallery ga ON p.id = ga.product_id
LEFT JOIN product_suppliers p_su ON p.id = p_su.product_id
LEFT JOIN suppliers sp ON p_su.supplier_id = sp.id
LEFT JOIN product_tags pt ON p.id = pt.product_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.slug = ?
GROUP BY p.id;
`;
  try {
    // Prepara y ejecuta la consulta SQL con el parámetro proporcionado
    const { results } = await db.prepare(productQuery).bind(id).all();
    return results; // Devuelve los resultados de la consulta
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error; // Lanza el error para que pueda ser manejado en el llamador
  }
}








export async function getConfig(db, id) {
  const productQuery = `

  SELECT 
  json_group_array(
      json_object(
          'suppliers', (SELECT json_group_array(json_object(
              'id', s.id,
              'supplier_name', s.supplier_name
          )) FROM suppliers s),
          'attributes', (SELECT json_group_array(json_object(
              'id', a.id,
              'attribute_name', a.attribute_name
          )) FROM attributes a),
          'attribute_values', (SELECT json_group_array(json_object(
              'id', av.id,
              'attribute_id', av.attribute_id,
              'attribute_value', av.attribute_value
          )) FROM attribute_values av),
          'categories', (SELECT json_group_array(json_object(
              'id', c.id,
              'category_name', c.category_name
          )) FROM categories c),
          'coupons', (SELECT json_group_array(json_object(
              'id', cd.id,
              'code', cd.code,
              'discount_value', cd.discount_value,
              'discount_type', cd.discount_type
          )) FROM coupons cd),
          'tags', (SELECT json_group_array(json_object(
              'id', t.id,
              'tag_name', t.tag_name,
              'icon', t.icon
          )) FROM tags t)
      )
  ) AS data;


`;
try {
  // Prepara y ejecuta la consulta SQL con el parámetro proporcionado
  const { results } = await db.prepare(productQuery).all();
  return results; // Devuelve los resultados de la consulta
} catch (error) {
  console.error('Error executing SQL:', error);
  throw error; // Lanza el error para que pueda ser manejado en el llamador
}
}















export async function getAllContent(db) {
  const { results } = await db.prepare('SELECT * FROM users').all();
  return results;
}

export async function getD1DataByTable(db, table, params) {
  const sql = generateSelectSql(table, params);
  const { results } = await db.prepare(sql).all();
  return params?.id ? results[0] : results;
}

export function generateSelectSql(table, params) {
  // console.log("params ==>", JSON.stringify(params, null, 2));

  var whereClause = '';
  var sortBySyntax = '';
  var limitSyntax: string = '';
  var offsetSyntax = '';

  if (params && params.id) {
    whereClause = `WHERE id = '${params.id}'`;
  } else if (params) {
    let { limit, offset, filters } = params;

    sortBySyntax = sortClauseBuilder(params);

    limit = limit ?? 0;
    limitSyntax = limit > 0 ? `limit ${limit}` : '';
    // console.log("limitSyntax ==>", limitSyntax);

    offset = offset ?? 0;
    offsetSyntax = offset > 0 ? `offset ${offset}` : '';

    whereClause = whereClauseBuilder(filters);
  }

  let sql = `SELECT *, COUNT() OVER() AS total FROM ${table} ${whereClause} ${sortBySyntax} ${limitSyntax} ${offsetSyntax}`;
  sql = sql.replace(/\s+/g, ' ').trim() + ';';

  console.log('sql ==>', sql);
  return sql;
}


export function prepareD1Data(data, tbl = '') {
  const table = data.table || tbl;
  const schema = getRepoFromTable(table);
  const now = new Date().getTime();
  data.createdOn = now;
  data.updatedOn = now;
  delete data.table;

  if (!schema.id) {
    delete data.id;
  }
  return data;
}

export async function insertD1Data(d1, kv, table, data) {
  const db = drizzle(d1);
  data = prepareD1Data(data, table);
  const schema = getRepoFromTable(table);
  try {
    // let sql = db.insert(schmea).values(data).getSQL();
    let result = await db.insert(schema).values(data).returning().get();
    return result;
  } catch (error) {
    return error;
  }
}

export async function deleteD1ByTableAndId(d1, table, id) {
  console.log('deleteD1ByTableAndId', table, id);
  const db = drizzle(d1);

  const schmea = getRepoFromTable(table);
  let sql = await db.delete(schmea).where(eq(schmea.id, id)).toSQL();

  let result = await db.delete(schmea).where(eq(schmea.id, id)).run();

  return result;
}

export async function updateD1Data(
  d1,
  table,
  data,
  params?: Record<string, any>
) {
  const db = drizzle(d1);
  const schemaTable = table ?? data.table;
  const repo = getRepoFromTable(schemaTable);
  const recordId = data.id;
  // delete data.table;
  if (data.data && data.data.id) {
    delete data.data.id;
  }

  const now = new Date().getTime();
  data.data.updatedOn = now;

  const eqArgs = [eq(repo.id, recordId)];
  if (params) {
    for (const key in params) {
      if (key !== 'id') {
        eqArgs.push(eq(repo[key], params[key]));
      }
    }
  }
  let result = await db
    .update(repo)
    .set(data.data)
    .where(and(...eqArgs))
    .returning({ id: repo.id })
    .values();

  // let result = await db
  // .update(repo)
  // .set(data)
  // .where(eq(repo.id, data.id))
  // // .returning({ updated: users.updatedAt })
  // .values();

  // .returning().get();

  const id = result && result[0] ? result[0]['0'] : undefined;

  // console.log("updating data result ", result);

  return { id } ?? result;
}

export function getSchemaFromTable(tableName) {
  return tableSchemas[tableName]?.definition;
}

export function getRepoFromTable(tableName) {
  return tableSchemas[tableName]?.table;
}

export function sortClauseBuilder(params) {
  let sortClause = '';

if(params.sort){
  sortClause = 'order by ' + params.sort.join(", ").replace(new RegExp(":", "g"),' ')
}

  return sortClause;
}

export function whereClauseBuilder(filters: any) {
  let whereClause = '';

  if (!filters || Object.keys(filters).length === 0) {
    return whereClause;
  }

  let AND = '';
  whereClause = 'WHERE';
  for (const key of Object.keys(filters)) {
    let filter = filters[key];
    let condition = Object.keys(filter)[0];
    // if (typeof filter === 'string') {
    //   if (filter.toLowerCase().includes('is')) {
    //     whereClause = `${whereClause} ${AND} ${key} ${filter}`;
    //   } else {
    //     whereClause = `${whereClause} ${AND} ${key} = '${filter}'`;
    //   }
    // } else {
    //   whereClause = `${whereClause} ${AND} ${key} = ${filter}`;
    // }
    whereClause = `${whereClause} ${AND} ${key} ${processCondition(
      condition
    )} '${filter[condition]}'`;

    AND = 'AND';
  }
  return whereClause;
}

export function processCondition(condition) {
  switch (condition) {
    case '$eq':
      return '=';
      break;

    default:
      break;
  }
}
