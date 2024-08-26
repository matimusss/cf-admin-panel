import { Head, Layout, Script, ToggleTheme } from '../theme';

export const ProductForm = (props: { children?: string; screenTitle?: string }) => {
  return (
  );
  <Layout>
<form id='formio-products'></form>

  </Layout>
};

export async function loadProductForm(ctx) {
  return <ProductForm screenTitle='Crear Producto' />;
}
