import {
  sqliteTable,
  text,
  integer
} from "drizzle-orm/sqlite-core";
import { auditSchema } from './audit';
import { ApiConfig } from '../routes';
import { isAdminOrUser } from '../config-helpers';
// Definición de la estructura de la tabla
export const tableName = 'pages';
export const route = 'pages';

export const definition = {
  id: text('id').primaryKey(), // Se define como clave primaria e INTEGER
  name: text('name'), // Campo de texto para el nombre de la página
  slug: text('slug'), // Campo de texto para el slug de la página
  html_code: text('html_code'), // Campo de texto para el código HTML de la página
  css_code: text('css_code')
};


export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

export const access: ApiConfig['access'] = {
  operation: {
    read: true,
    create: true,
    update: isAdminOrUser,
    delete: isAdminOrUser
  }
};