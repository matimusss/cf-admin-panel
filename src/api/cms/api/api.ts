import { Hono } from 'hono';
import { loadForm } from '../admin/forms/form';
import {
  clearAllKVRecords,
  clearKVCache,
  getDataByPrefix,
  getDataListByPrefix,
  getKVCache,
  saveContentType,
  getRecordFromKvCache,
  addToKvCache
} from '../data/kv-data';
import { Bindings } from '../types/bindings';
import { apiConfig, config } from '../../db/routes';
import { getD1DataByTable, getD1ByTableAndSlug_view , getProduct, getConfig, getProductBySlug, getProductMinDetails  } from '../data/d1-data';
import { getForm } from './forms';
import qs from 'qs';
import {
  deleteRecord,
  getRecords,
  insertRecord,
  updateRecord
} from '../data/data';
import { clearInMemoryCache, getAllFromInMemoryCache } from '../data/cache';
import { Variables } from '../../server';
import {
  filterCreateFieldAccess,
  filterReadFieldAccess,
  filterUpdateFieldAccess,
  getApiAccessControlResult,
  getItemReadResult,
  getOperationCreateResult,
  
} from '../auth/auth-helpers';

const api = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const tables = apiConfig.filter((tbl) => tbl.table !== 'users');
tables.forEach((entry) => {
  // console.log("setting route for " + entry.route);
  //EJEMPLO DE RUTA CON QUERY PERSONALIZADA, request a una view.
  //api.get('/product-full-details', async (ctx) => {
  //let { includeContentType, source, ...params } = ctx.req.query();
  //const query = 'SELECT * FROM product_full_details'; // Query personalizada
  //   try {
  // Ejecuta la consulta utilizando `getRecords`
  //const data = await getRecords(ctx, 'product_full_details', params, ctx.req.url,"d1", query);  
  // Devuelve los resultados
  //  return ctx.json(data);
  // } catch (error) {
  //console.error('Error retrieving product full details:', error);
  //return ctx.text('Error retrieving product full details', 500);
  //}
  //});




//EJEMPLO DE RUTA CON RUTA DINAMICA Y REFIRIENDOSE A UNA VISTA.

  api.get('/getProductBySlug/:slug', async (ctx) => {
    const { slug } = ctx.req.param(); // Obtén el parámetro ID de la URL

    const data = await getProductBySlug(ctx.env.D1DATA, slug);
    try {
      // Llama a la función getD1ByTableAndId para obtener los datos del producto
      if (data) {
        let transformedData = { ...data[0] }; // Acceder al primer objeto en el array
  
        try {
          // Intenta parsear los campos de texto JSON
          if (data[0].product_attributes) {
            transformedData.product_attributes = JSON.parse(data[0].product_attributes);
          }
  
          if (data[0].tags) {
            transformedData.tags = JSON.parse(data[0].tags);
          }
  

          if (data[0].coupons) {
            transformedData.coupons = JSON.parse(data[0].coupons);
          }
  


          if (data[0].product_images) {
            transformedData.product_images = JSON.parse(data[0].product_images);
          }



          if (data[0].suppliers) {
            transformedData.suppliers = JSON.parse(data[0].suppliers);
          }



          if (data[0].variant_details) {
            const variantDetails = JSON.parse(data[0].variant_details);
            transformedData.variant_details = variantDetails.map(variant => JSON.parse(variant));
          }
        } catch (parseError) {
          console.error('Error parsing JSON fields:', parseError);
          return ctx.text('Error parsing product details', 500);
        }
  
        // FILTRADO DE ATRIBUTOS
  
        // Paso 1: Recopilar todos los nombres de atributos de las variantes
        const variantAttributeNames = new Set();
        transformedData.variant_details.forEach(variant => {
          variant.variant_attributes.forEach(attr => {
            variantAttributeNames.add(attr.variant_attribute_name);
          });
        });
  
        // Paso 2: Filtrar los product_attributes utilizando la lista de nombres de atributos
        const filteredProductAttributes = transformedData.product_attributes.filter(attr =>
          !variantAttributeNames.has(attr.attribute_name)
        );
  
        // Crear un nuevo objeto con los product_attributes filtrados
        const filteredData = {
          ...transformedData,
          product_attributes: filteredProductAttributes
        };
  
        return ctx.json(filteredData);
      } else {
        return ctx.text('Product not found', 404);
      }
    } catch (error) {
      console.error('Error retrieving product full details:', error);
      return ctx.text('Error retrieving product full details', 500);
    }
  });
  

  api.get('/getConfig', async (ctx) => {
    try {
      // Llama a la función getConfig para obtener los datos del producto
      const data = await getConfig(ctx.env.D1DATA, '');
      
      if (data && data.length > 0) {
        // Parsear la propiedad data de cada elemento del array
        const parsedData = data.map(item => {
          return {
            ...item,
            data: JSON.parse(item.data)
          };
        });
        
        return ctx.json(parsedData);
      } else {
        return ctx.text('Product not found', 404);
      }
    } catch (error) {
      console.error('Error retrieving product full details:', error);
      return ctx.text('Error retrieving product full details', 500);
    }
  });
  




  api.get('/product-min-details', async (ctx) => {
    try {
      // Llama a la función getD1ByTableAndId para obtener los datos del producto
      const data = await 354261|MinDetails(   ctx.env.D1DATA, 'products');
      if (data) {
        return ctx.json(data);
      } else {
        return ctx.text('Product not found', 404);
      }
    } catch (error) {
      console.error('Error retrieving product full details:', error);
      return ctx.text('Error retrieving product full details', 500);
    }
  });








////////////////////////          


  //ie /v1/users
  api.get(`/${entry.route}`, async (ctx) => {
    const start = Date.now();
    const query = ctx.req.query();
    const params = qs.parse(query);

    if (entry.hooks?.beforeOperation) {
      await entry.hooks.beforeOperation(ctx, 'read', params.id);
    }
    const accessControlResult = await getApiAccessControlResult(
      entry?.access?.operation?.read || true,
      entry?.access?.filter?.read || true,
      true,
      ctx,
      params.id,
      entry.table
    );

    if (typeof accessControlResult === 'object') {
      params.accessControlResult= {...accessControlResult };
    }

    if (!accessControlResult) {
      return ctx.text('Unauthorized', 401);
    }

    try {
      params.limit = params.limit ?? '1000';
      ctx.env.D1DATA = ctx.env.D1DATA;
      let data = await getRecords(
        ctx,
        entry.table,
        params,
        ctx.req.url,
        'fastest',
        undefined
      );

      if (entry.access?.item?.read) {
        const accessControlResult = await getItemReadResult(
          entry.access.item.read,
          ctx,
          data
        );
        if (!accessControlResult) {
          return ctx.text('Unauthorized', 401);
        }
      }
      data.data = await filterReadFieldAccess(
        entry.access?.fields,
        ctx,
        data.data
      );

      if (entry.hooks?.afterOperation) {
        await entry.hooks.afterOperation(ctx, 'read', params.id, null, data);
      }
      const end = Date.now();
      const executionTime = end - start;

      return ctx.json({ ...data, executionTime });
    } catch (error) {
      console.log(error);
      return ctx.text(error);
    }
  });




  api.get('/getProduct/:id', async (ctx) => {
    const { id } = ctx.req.param(); // Obtén el parámetro ID de la URL
    try {
      // Llama a la función getProduct para obtener los datos del producto
      const data = await getProduct(ctx.env.D1DATA, id);
  
      if (data) {
        let transformedData = { ...data[0] }; // Acceder al primer objeto en el array
  
        try {
          // Intenta parsear los campos de texto JSON
          if (data[0].product_attributes) {
            transformedData.product_attributes = JSON.parse(data[0].product_attributes);
          }
  
          if (data[0].tags) {
                        // 
            transformedData.tags = JSON.parse(data[0].tags);
          }
  

          if (data[0].coupons) {
            transformedData.coupons = JSON.parse(data[0].coupons);
          }

          if (data[0].product_images) {
            transformedData.product_images = JSON.parse(data[0].product_images);
          }
          if (data[0].suppliers) {
            transformedData.suppliers = JSON.parse(data[0].suppliers);
          }
          if (data[0].categories) {
            transformedData.categories = JSON.parse(data[0].categories);
          }
          if (data[0].variant_details) {
            const variantDetails = JSON.parse(data[0].variant_details);
            transformedData.variant_details = variantDetails.map(variant => JSON.parse(variant));
          }
        } catch (parseError) {
          console.error('Error parsing JSON fields:', parseError);
          return ctx.text('Error parsing product details', 500);
        }
  
        // FILTRADO DE ATRIBUTOS
  
        // Paso 1: Recopilar todos los nombres de atributos de las variantes
        const variantAttributeNames = new Set();
        transformedData.variant_details.forEach(variant => {
          variant.variant_attributes.forEach(attr => {
            variantAttributeNames.add(attr.variant_attribute_name);
          });
        });
  
        // Paso 2: Filtrar los product_attributes utilizando la lista de nombres de atributos
        const filteredProductAttributes = transformedData.product_attributes.filter(attr =>
          !variantAttributeNames.has(attr.attribute_name)
        );
  
        // Crear un nuevo objeto con los product_attributes filtrados
        const filteredData = {
          ...transformedData,
          product_attributes: filteredProductAttributes
        };
  
        return ctx.json(filteredData);
      } else {
        return ctx.text('Product not found', 404);
      }
    } catch (error) {
      console.error('Error retrieving product full details:', error);
      return ctx.text('Error retrieving product full details', 500);
    }
   });
  












  api.get('/product-min-details', async (ctx) => {
    try {
      // Llama a la función getD1ByTableAndId para obtener los datos del producto
      const data = await getProduct(   ctx.env.D1DATA, 'product_min_details');
      if (data) {
        return ctx.json(data);
      } else {
        return ctx.text('Product not found', 404);
      }
    } catch (error) {
      console.error('Error retrieving product full details:', error);
      return ctx.text('Error retrieving product full details', 500);
    }
  });








////////////////////////          


  //ie /v1/users
  api.get(`/${entry.route}`, async (ctx) => {
    const start = Date.now();
    const query = ctx.req.query();
    const params = qs.parse(query);

    if (entry.hooks?.beforeOperation) {
      await entry.hooks.beforeOperation(ctx, 'read', params.id);
    }
    const accessControlResult = await getApiAccessControlResult(
      entry?.access?.operation?.read || true,
      entry?.access?.filter?.read || true,
      true,
      ctx,
      params.id,
      entry.table
    );

    if (typeof accessControlResult === 'object') {
      params.accessControlResult= {...accessControlResult };
    }

    if (!accessControlResult) {
      return ctx.text('Unauthorized', 401);
    }

    try {
      params.limit = params.limit ?? '1000';
      ctx.env.D1DATA = ctx.env.D1DATA;
      let data = await getRecords(
        ctx,
        entry.table,
        params,
        ctx.req.url,
        'fastest',
        undefined
      );

      if (entry.access?.item?.read) {
        const accessControlResult = await getItemReadResult(
          entry.access.item.read,
          ctx,
          data
        );
        if (!accessControlResult) {
          return ctx.text('Unauthorized', 401);
        }
      }
      data.data = await filterReadFieldAccess(
        entry.access?.fields,
        ctx,
        data.data
      );

      if (entry.hooks?.afterOperation) {
        await entry.hooks.afterOperation(ctx, 'read', params.id, null, data);
      }
      const end = Date.now();
      const executionTime = end - start;

      return ctx.json({ ...data, executionTime });
    } catch (error) {
      console.log(error);
      return ctx.text(error);
    }
  });

  //redirect users to auth controller
  api.get(`/users`, async (ctx) => {
    return ctx.redirect('/v1/auth/users');
  });

  //get single record
  api.get(`/${entry.route}/:id`, async (ctx) => {
    const start = Date.now();

    let { includeContentType, source, ...params } = ctx.req.query();

    const id = ctx.req.param('id');

    if (entry.hooks?.beforeOperation) {
      await entry.hooks.beforeOperation(ctx, 'read', id);
    }

    params.id = id;
    // will check the item result when we get the data
    const accessControlResult = await getApiAccessControlResult(
      entry?.access?.operation?.read || true,
      entry?.access?.filter?.read || true,
      true,
      ctx,
      id,
      entry.table
    );

    if (typeof accessControlResult === 'object') {
      params = { ...params, ...accessControlResult };
    }

    if (!accessControlResult) {
      return ctx.text('Unauthorized', 401);
    }

    ctx.env.D1DATA = ctx.env.D1DATA;

    source = source || 'fastest';
    if (includeContentType !== undefined) {
      source = 'd1';
    }

    let data = await getRecords(
      ctx,
      entry.table,
      params,
      ctx.req.url,
      source, //hardcodeado para tomar datos de d1
      undefined
    );

    if (entry.access?.item?.read) {
      const accessControlResult = await getItemReadResult(
        entry.access.item.read,
        ctx,
        data
      );
      if (!accessControlResult) {
        return ctx.text('Unauthorized', 401);
      }
    }
    data = await filterReadFieldAccess(entry.access?.fields, ctx, data);
    if (includeContentType !== undefined) {
      data.contentType = getForm(ctx, entry.table);
    }

    if (entry.hooks?.afterOperation) {
      await entry.hooks.afterOperation(ctx, 'read', id, null, data);
    }

    const end = Date.now();
    const executionTime = end - start;

    return ctx.json({ ...data, executionTime });
  });
//added no cache

  //ie /v1/users
  api.get(`/nc/${entry.route}`, async (ctx) => {
    const start = Date.now();
    const query = ctx.req.query();
    const params = qs.parse(query);

    if (entry.hooks?.beforeOperation) {
      await entry.hooks.beforeOperation(ctx, 'read', params.id);
    }
    const accessControlResult = await getApiAccessControlResult(
      entry?.access?.operation?.read || true,
      entry?.access?.filter?.read || true,
      true,
      ctx,
      params.id,
      entry.table
    );

    if (typeof accessControlResult === 'object') {
      params.accessControlResult= {...accessControlResult };
    }

    if (!accessControlResult) {
      return ctx.text('Unauthorized', 401);
    }

    try {
      params.limit = params.limit ?? '1000';
      ctx.env.D1DATA = ctx.env.D1DATA;
      let data = await getRecords(
        ctx,
        entry.table,
        params,
        ctx.req.url,
        'd1', //hardcodeado para tomar datos de d1
        undefined
      );

      if (entry.access?.item?.read) {
        const accessControlResult = await getItemReadResult(
          entry.access.item.read,
          ctx,
          data
        );
        if (!accessControlResult) {
          return ctx.text('Unauthorized', 401);
        }
      }
      data.data = await filterReadFieldAccess(
        entry.access?.fields,
        ctx,
        data.data
      );

      if (entry.hooks?.afterOperation) {
        await entry.hooks.afterOperation(ctx, 'read', params.id, null, data);
      }
      const end = Date.now();
      const executionTime = end - start;

      return ctx.json({ ...data, executionTime });
    } catch (error) {
      console.log(error);
      return ctx.text(error);
    }
  });

  //get single record
  api.get(`/nc/${entry.route}/:id`, async (ctx) => {
    const start = Date.now();

    let { includeContentType, source, ...params } = ctx.req.query();

    const id = ctx.req.param('id');

    if (entry.hooks?.beforeOperation) {
      await entry.hooks.beforeOperation(ctx, 'read', id);
    }

    params.id = id;
    // will check the item result when we get the data
    const accessControlResult = await getApiAccessControlResult(
      entry?.access?.operation?.read || true,
      entry?.access?.filter?.read || true,
      true,
      ctx,
      id,
      entry.table
    );

    if (typeof accessControlResult === 'object') {
      params = { ...params, ...accessControlResult };
    }

    if (!accessControlResult) {
      return ctx.text('Unauthorized', 401);
    }

    ctx.env.D1DATA = ctx.env.D1DATA;

    source = source || 'fastest';
    if (includeContentType !== undefined) {
      source = 'd1';
    }

    let data = await getRecords(
      ctx,
      entry.table,
      params,
      ctx.req.url,
      'd1', //hardcodeado para tomar datos de d1
      undefined
    );

    if (entry.access?.item?.read) {
      const accessControlResult = await getItemReadResult(
        entry.access.item.read,
        ctx,
        data
      );
      if (!accessControlResult) {
        return ctx.text('Unauthorized', 401);
      }
    }
    data = await filterReadFieldAccess(entry.access?.fields, ctx, data);
    if (includeContentType !== undefined) {
      data.contentType = getForm(ctx, entry.table);
    }

    if (entry.hooks?.afterOperation) {
      await entry.hooks.afterOperation(ctx, 'read', id, null, data);
    }

    const end = Date.now();
    const executionTime = end - start;

    return ctx.json({ ...data, executionTime });
  });
  //-




























  //create single record
  //TODO: support batch inserts
  api.post(`/${entry.route}`, async (ctx) => {
    let content = await ctx.req.json();
    const route = ctx.req.path.split('/')[2];
    const table = apiConfig.find((entry) => entry.route === route).table;
    ctx.env.D1DATA = ctx.env.D1DATA;

    if (entry.hooks?.beforeOperation) {
      await entry.hooks.beforeOperation(ctx, 'create', undefined, content);
    }

    content.table = table;

    let authorized = await getOperationCreateResult(
      entry?.access?.operation?.create,
      ctx,
      content.data
    );
    if (!authorized) {
      return ctx.text('Unauthorized', 401);
    }

    try {
      // console.log("posting new record content", JSON.stringify(content, null, 2));
      content.data = await filterCreateFieldAccess(
        entry?.access?.fields,
        ctx,
        content.data
      );
      if (entry?.hooks?.resolveInput?.create) {
        content.data = await entry.hooks.resolveInput.create(ctx, content.data);
      }
      console.log('posting new record content filtered?', content.data);
      const result = await insertRecord(
        ctx.env.D1DATA,
        ctx.env.KVDATA,
        content
      );
      console.log('create result', result);

      if (entry?.hooks?.afterOperation) {
        await entry.hooks.afterOperation(
          ctx,
          'create',
          result?.data?.['id'],
          content,
          result
        );
      }
      return ctx.json(result?.data, 201);
    } catch (error) {
      console.log('error posting content', error);
      return ctx.text(error, 500);
    }
  });

  //update single record
  //TODO: support batch inserts
  api.put(`/${entry.route}/:id`, async (ctx) => {
    const payload = await ctx.req.json();
    const id = ctx.req.param('id');
    var content: { data?: any; table?: string; id?: string } = {};
    ctx.env.D1DATA = ctx.env.D1DATA;
    content.data = payload.data;
    console.log('put content', JSON.stringify(content.data, null, 2));
    if (entry.hooks?.beforeOperation) {
      await entry.hooks?.beforeOperation(ctx, 'update', id, content);
    }

    let { includeContentType, source, ...params } = ctx.req.query();
    const accessControlResult = await getApiAccessControlResult(
      entry?.access?.operation?.update || true,
      entry?.access?.filter?.update || true,
      entry?.access?.item?.update || true,
      ctx,
      id,
      entry.table,
      content.data
    );

    if (typeof accessControlResult === 'object') {
      params = { ...params, ...accessControlResult };
    }

    if (!accessControlResult) {
      return ctx.text('Unauthorized', 401);
    }

    const route = ctx.req.path.split('/')[2];
    const table = apiConfig.find((entry) => entry.route === route).table;

    content.table = table;
    content.id = id;

    try {
      content.data = await filterUpdateFieldAccess(
        entry.access?.fields,
        ctx,
        id,
        content.data
      );
      if (entry?.hooks?.resolveInput?.update) {
        content.data = await entry.hooks.resolveInput.update(
          ctx,
          id,
          content.data
        );
      }
      const result = await updateRecord(
        ctx.env.D1DATA,
        ctx.env.KVDATA,
        content,
        params
      );
      if (entry?.hooks?.afterOperation) {
        await entry.hooks.afterOperation(ctx, 'update', id, content, result);
      }
      return ctx.json(result.data, 200);
    } catch (error) {
      console.log('error updating content', error);
      return ctx.text(error, 500);
    }
  });

  //delete
  api.delete(`/${entry.route}/:id`, async (ctx) => {
    const id = ctx.req.param('id');
    const table = ctx.req.path.split('/')[2];
    ctx.env.D1DATA = ctx.env.D1DATA;

    if (entry.hooks?.beforeOperation) {
      await entry.hooks.beforeOperation(ctx, 'delete', id);
    }

    let { includeContentType, source, ...params } = ctx.req.query();

    const accessControlResult = await getApiAccessControlResult(
      entry?.access?.operation?.delete || true,
      entry?.access?.filter?.delete || true,
      entry?.access?.item?.delete || true,
      ctx,
      id,
      entry.table
    );

    if (typeof accessControlResult === 'object') {
      params = { ...params, ...accessControlResult };
    }

    if (!accessControlResult) {
      return ctx.text('Unauthorized', 401);
    }
    params.id = id;

    const record = await getRecords(
      ctx,
      table,
      params,
      ctx.req.path,
      source || 'fastest',
      undefined
    );

    if (record) {
      console.log('content found, deleting...');
      const result = await deleteRecord(ctx.env.D1DATA, ctx.env.KVDATA, {
        id,
        table: table
      });
      if (entry?.hooks?.afterOperation) {
        await entry.hooks.afterOperation(ctx, 'delete', id, record, result);
      }
      // const kvDelete = await deleteKVById(ctx.env.KVDATA, id);
      // const d1Delete = await deleteD1ByTableAndId(
      //   ctx.env.D1DATA,
      //   content.data.table,
      //   content.data.id
      // );
      console.log('returning 204');
      return ctx.text('', 204);
    } else {
      console.log('content not found');
      return ctx.text('', 404);
    }
  });
});

api.get('/ping', (ctx) => {
  return ctx.json(`${ctx.req.path} is all good`);
});

api.get('/kv-test', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const createdOn = new Date().getTime();

  await ctx.env.KVDATA.put(
    'cache::kv-test-key',
    JSON.stringify({ foo: 'bar' }),
    {
      metadata: { createdOn }
    }
  );

  const { value, metadata } = await ctx.env.KVDATA.getWithMetadata(
    'kv-test-key',
    { type: 'json' }
  );

  return ctx.json({ value, metadata });
});

api.get('/kv-test2', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const cacheKey = 'kv-test-key2';
  const total = 100;
  const d1Data = [{ a: '1', b: '2' }];
  const data = { data: d1Data, source: 'kv', total };
  await addToKvCache(ctx, ctx.env.KVDATA, cacheKey, data);

  // await ctx.env.KVDATA.put(cacheKey, JSON.stringify({ foo: "bar" }), {
  //   metadata: { createdOn: "123" },
  // });

  // const list = await ctx.env.KVDATA.list();
  // console.log("list", list);

  const { value, metadata } = await ctx.env.KVDATA.getWithMetadata(
    `cache::${cacheKey}`,
    {
      type: 'json'
    }
  );

  return ctx.json({ value, metadata });
});

api.get('/kv-list', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const list = await ctx.env.KVDATA.list();
  return ctx.json(list);
});

api.get('/data', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const data = await getDataListByPrefix(ctx.env.KVDATA, '');
  return ctx.json(data);
});

api.get('/forms', async (ctx) => {
  return ctx.html(await loadForm(ctx));
});

api.get('/form-components/:route', async (ctx) => {
  const route = ctx.req.param('route');

  const table = apiConfig.find((entry) => entry.route === route).table;

  let ct = await getForm(ctx, table);
  return ctx.json(ct);
});

api.get('/form-components/auth/users', async (ctx) => {
  let ct = await getForm(ctx, 'users');
  return ctx.json(ct);
});
api.post('/form-components', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const formComponents = await ctx.req.json();

  console.log('formComponents-->', formComponents);
  //put in kv
  const result = await saveContentType(ctx.env.KVDATA, 'site1', formComponents);

  console.log('form put', result);
  return ctx.text('Created!', 201);
});

api.get('/cache/clear-all', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);

  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  console.log('clearing cache');
  await clearInMemoryCache();
  await clearKVCache(ctx.env.KVDATA);
  return ctx.text('in memory and kv caches cleared');
});

api.get('/cache/clear-in-memory', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  console.log('clearing cache');
  await clearInMemoryCache();
  return ctx.text('in memory cache cleared');
});

api.get('/cache/clear-kv', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  console.log('clearing cache');
  await clearKVCache(ctx.env.KVDATA);
  return ctx.text('kv cache cleared');
});

api.get('/cache/in-memory', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  console.log('clearing cache');
  const cacheItems = await getAllFromInMemoryCache();
  return ctx.json(cacheItems);
});

api.get('/cache/kv', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const cacheItems = await getKVCache(ctx.env.KVDATA);
  console.log('getting kv cache', cacheItems);
  return ctx.json(cacheItems);
});

api.get('/cache/kv/:cacheKey', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const cacheKey = ctx.req.param('cacheKey');
  const cacheItem = await getRecordFromKvCache(ctx.env.KVDATA, cacheKey);
  console.log('getting kv cache', cacheItem);
  return ctx.json(cacheItem);
});

api.get('/kv', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const allItems = await getDataByPrefix(ctx.env.KVDATA, '', 2);
  return ctx.json(allItems);
});

api.get('/kv/:cacheKey', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  const cacheKey = ctx.req.param('cacheKey');
  console.log('getting kv cache', cacheKey);

  const cacheItem = await getRecordFromKvCache(
    ctx.env.KVDATA,
    'http://127.0.0.1:8788/admin/api/users'
  );
  console.log('getting kv cache', cacheItem);
  return ctx.json(cacheItem);
});

api.get('/kv/delete-all', async (ctx) => {
  const canProceed = await config.adminAccessControl(ctx);
  if (!canProceed) {
    return ctx.text('Unauthorized', 401);
  }
  await clearAllKVRecords(ctx.env.KVDATA);
  return ctx.text('ok');
});

export { api };
