import { ApiConfig, apiConfig } from '../../db/routes';
import { Bindings } from '../types/bindings';
import { FC } from 'hono/jsx';
import GjsEditor from '@grapesjs/react';
import './style.css';
import grapesjs, { Editor } from 'grapesjs';
var Slugify = require('slugifyjs');


export const Head = () => {
  return (
    <head>
      <script src='/public/js/color-modes.js'></script>
      <meta charset='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content='' />
      <title>SonicJs Admin</title>
      <link rel='icon' type='image/x-icon' href='/public/images/favicon.ico' />

      <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></link>
      <link rel="stylesheet" href="/public/css/toastr.min.css"></link>
    <link rel="stylesheet" href="/public/css/grapes.min.css?v0.21.10"></link>
    <link rel="stylesheet" href="/public/css/grapesjs-preset-webpage.min.css"></link>
    <link rel="stylesheet" href="/public/css/demos.css?v3"></link>
    <link rel="stylesheet" href="/public/css/tooltip.css"></link>
  
    <link href="https://unpkg.com/grapick/dist/grapick.min.css" rel="stylesheet"></link>
      <link
        href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
        rel='stylesheet'
        integrity='sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN'
        crossorigin='anonymous'
      ></link>

<link type="text/css" rel="stylesheet" href="/public/css/image-uploader.css"></link>


      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css'
        integrity='sha384-b6lVK+yci+bfDmaY1u0zE8YYJt0TZxLEAFyYSLHId4xoVvsrQu3INevFKo+Xir8e'
        crossorigin='anonymous'
      ></link>
      <link
        rel='stylesheet'
        href='https://cdn.form.io/formiojs/formio.full.min.css'
      />

      <meta name='theme-color' content='#712cf9' />

  
      <link href='/public/css/gridjs.css' rel='stylesheet' />
 
      <link href='/public/css/gallery.css' rel='stylesheet' />



      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="/public/js/toastr.min.js"></script>
    <script src="/public/js/grapes.min.js?v0.21.10"></script>
    <script src="https://unpkg.com/grapesjs-preset-webpage@1.0.2"></script>
    <script src="https://unpkg.com/grapesjs-blocks-basic@1.0.1"></script>
    <script src="https://unpkg.com/grapesjs-plugin-forms@2.0.5"></script>
    <script src="https://unpkg.com/grapesjs-component-countdown@1.0.1"></script>
    <script src="https://unpkg.com/grapesjs-plugin-export@1.0.11"></script>
    <script src="https://unpkg.com/grapesjs-tabs@1.0.6"></script>
    <script src="https://unpkg.com/grapesjs-custom-code@1.0.1"></script>
    <script src="https://unpkg.com/grapesjs-touch@0.1.1"></script>
    <script src="https://unpkg.com/grapesjs-parser-postcss@1.0.1"></script>
    <script src="https://unpkg.com/grapesjs-tooltip@0.1.7"></script>
    <script src="https://unpkg.com/grapesjs-tui-image-editor@0.1.3"></script>
    <script src="https://unpkg.com/grapesjs-typed@1.0.5"></script>
    <script src="https://unpkg.com/grapesjs-style-bg@2.0.1"></script>

    <script src='/public/js/image-uploader.js'></script>
    <link href='/public/css/admin.css' rel='stylesheet' />

    </head>
  );
};





export const Script = () => {
  return (
    <>

<script src='/public/js/sluger.js'></script>
      <script
        src='https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.min.js'
        integrity='sha384-uO3SXW5IuS1ZpFPKugNNWqTZRRglnUJK6UAZ/gxOX80nxEkN9NcGZTftn6RzhGWE'
        crossorigin='anonymous'
      ></script>

      <script src='/public/js/dashboard.js'></script>
      <script src="
https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
"></script>

      <script src='https://cdn.form.io/formiojs/formio.full.min.js'></script>
      <script
        src='https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js'
        integrity='sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ=='
        crossorigin='anonymous'
        referrerpolicy='no-referrer'
      ></script>

      <script
        src='https://code.jquery.com/jquery-3.7.0.min.js'
        integrity='sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g='
        crossorigin='anonymous'
      ></script>

      <script src='https://unpkg.com/gridjs/dist/gridjs.umd.js'></script>

      <script src='/public/js/admin.js'></script>
      <script src='/public/js/form-content-type.js'></script>
      <script src='/public/js/form-content.js'></script>
      <script src='/public/js/form-products.js'></script>
      <script src='/public/js/form-login.js'></script>
      <script src='/public/js/grid_products.js'></script>
      <script src='/public/js/grid_categories.js'></script>
      <script src='/public/js/grid_tags.js'></script>
      <script src='/public/js/grid_orders.js'></script>
      <script src='/public/js/grid_coupons.js'></script>
      <script src='/public/js/grid_attributes.js'></script>

      <script src='/public/js/grid.js'></script>
      <script src='/public/js/grid-in-memory-cache.js'></script>
      <script src='/public/js/grid-kv-cache.js'></script>
  
      <script
        src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
        integrity='sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL'
        crossorigin='anonymous'
      ></script>



      
    </>
  );
};




export const ToggleTheme = () => {
  return (
    <div class='dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle'>
      <button
        class='btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center'
        id='bd-theme'
        type='button'
        aria-expanded='false'
        data-bs-toggle='dropdown'
        aria-label='Toggle theme (auto)'
      >
        <i class='bi bi-sun me-2'></i>
        <span class='visually-hidden' id='bd-theme-text'>
          Toggle theme
        </span>
      </button>
      <ul
        class='dropdown-menu dropdown-menu-end shadow'
        aria-labelledby='bd-theme-text'
      >
        <li>
          <button
            type='button'
            class='dropdown-item d-flex align-items-center'
            data-bs-theme-value='light'
            aria-pressed='false'
          >
            <i class='bi bi-sun me-2'></i>
            Light
            <svg class='bi ms-auto d-none' width='1em' height='1em'>
              <use href='#check2'></use>
            </svg>
          </button>
        </li>
        <li>
          <button
            type='button'
            class='dropdown-item d-flex align-items-center'
            data-bs-theme-value='dark'
            aria-pressed='false'
          >
            <i class='bi bi-moon-stars me-2'></i>
            Dark
            <svg class='bi ms-auto d-none' width='1em' height='1em'>
              <use href='#check2'></use>
            </svg>
          </button>
        </li>
        <li>
          <button
            type='button'
            class='dropdown-item d-flex align-items-center active'
            data-bs-theme-value='auto'
            aria-pressed='true'
          >
            <i class='bi bi-circle-half me-2'></i>
            Auto
            <svg class='bi ms-auto d-none' width='1em' height='1em'>
              <use href='#check2'></use>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
};





export const Layout: FC<{
  formComponents?: any[];
  screenTitle?: string;
  newItemButtonText?: string;
  username?: string;
  env: Bindings;
}> = (props) => {
  const tables = apiConfig;
  const onEditor = (editor: Editor) => {
    console.log('Editor loaded', { editor });
  };
  return (
    <html lang='en' data-bs-theme='auto'>
      <Head />
      <body>
      <script src='/public/js/image-uploader.js'></script>


  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Form.io Form</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div id="formio-create-attributes"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

        
  <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Form.io Form</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div id="formio-create-attributes-values"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>





        <ToggleTheme />
        <header class='navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow'>
          <a
            class='navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6'
            href='/admin'
          >
            <img class='logo' src='/public/images/sonicjs-logo.svg' />
          </a>
          <button
            class='navbar-toggler position-absolute d-md-none collapsed'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#sidebarMenu'
            aria-controls='sidebarMenu'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span class='navbar-toggler-icon'></span>
          </button>
          <input
            class='form-control form-control-dark w-100 rounded-0 border-0'
            type='text'
            placeholder='Search'
            aria-label='Search'
          />
        </header>

        <div class='container-fluid'>
          <div class='row'>
            <nav
              id='sidebarMenu'
              class='col-md-3 col-lg-2 d-md-block bg-body-tertiary sidebar collapse'
            >
              <div class='position-sticky pt-3 sidebar-sticky'>
                <ul class='nav flex-column'>

                  
          
              
                  <>


                    <h6 class='sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'>
                      <span>Auth</span>
                    </h6>
                    <li class='nav-item'>
                      <span class='px-3'>{props.username}</span>
                    </li>
                    <li class='nav-item'>
                      <a class='nav-link' href={'/admin/tables/auth/users'}>
                        Users
                      </a>
                    </li>

                    <li class='nav-item'>
                      <a class='nav-link' href='/v1/auth/logout'>
                        Logout
                      </a>
                    </li>
                  </>

                  <h6 class='sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'>
                    <span>Cache</span>
                  </h6>
                  <li class='nav-item'>
                    <a class='nav-link' href='/admin/cache/in-memory'>
                      In Memory
                    </a>
                  </li>
                  <li class='nav-item'>
                    <a class='nav-link' href='/admin/cache/kv'>
                      KV
                    </a>
                  </li>

                  <li class='nav-item'>
                    <a
                      id='clear-cache-all'
                      class='nav-link'
                      href='javascript:void(0)'
                    >
                      Clear All Caches
                    </a>
                  </li>
           
                  <h6 class='sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'>
                    <span>General</span>
                  </h6>
                  <li class='nav-item'>
                    <a class='nav-link'  href='/admin/prueba'>
                      Configuracion
                    </a>
                  </li>


                  <h6 class='sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'>
                    <span>CRUD´S</span>
                  </h6>
                  <li class='nav-item'>
                    <a class='nav-link'  href='/admin/OrdersCRUD'>
                    Panel de ordenes
                    </a>
                  </li>
                  <li class='nav-item'>
                    <a class='nav-link' href='/admin/AttributesCRUD'>
                    Panel de atributos
                    </a>
                  </li>

                  <li class='nav-item'>
                    <a class='nav-link' href='/admin/CategoriesCRUD'>
                    Panel de categorias
                    </a>
                  </li>

                  <li class='nav-item'>
                    <a class='nav-link' href='/admin/ProductCRUD'>
                    Panel de products
                    </a>
                  </li>

                  <li class='nav-item'>
                    <a class='nav-link' href='/admin/TagsCRUD'>
                    Panel de etiquetas
                    </a>
                  </li>
                  <li class='nav-item'>
                    <a class='nav-link' href='/admin/CouponsCRUD'>
                      Panel de cupones
                    </a>
                  </li>
                  
           

                  <h6 class='sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'>
                    <span>Agregados</span>
                  </h6>
                  <li class='nav-item'>
                    <a class='nav-link'  href='/admin/prueba'>
                      Editor de paginas/recursos HTML
                    </a>
                  </li>
  

            
           



           
                </ul>
           
              </div>
            </nav>

            <main class='col-md-9 ms-sm-auto col-lg-10  px-md-4'>
                  
                            <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                <h1 class='h2'>{props.screenTitle}</h1>
              </div>

              {props.children}
          
   


            </main>
            
          </div>
        </div>

        <Script />
      </body>
    </html>
  );
};



export const Top = (props: {
  items: object[];
  screenTitle: string;
  newItemButtonText: string;  
  username?: string;
  env: Bindings;
}) => {
  return (
    <Layout
      env={props.env}
      username={props.username}
      screenTitle={props.screenTitle}
    >
      <div class='pb-2 mb-3'>
        {/* <!-- Button trigger modal --> */}
        <button
          type='button'
          class='btn btn-warning'
          data-bs-toggle='modal'
          data-bs-target='#exampleModal'
        >
          {props.newItemButtonText}
        </button>
      </div>

      <ul>
          {props.items.map((item: any) => {
          return (
            <li>
              <a class='' href={item.path}>
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};




export const Detail = (props: {
  item: any;
  screenTitle: string;
  username?: string;
  env: Bindings;
}) => {
  return (
    <Layout
      env={props.env}
      username={props.username}
      screenTitle={props.screenTitle}
    >
      {props.item}
    </Layout>
  );
};











export const FormBuilder = (props: {
  title: string;
  screenTitle: string;
  saveButtonText: string;
  username?: string;
  env: Bindings;
}) => {
  return (
    <Layout
      env={props.env}
      username={props.username}
      screenTitle={props.screenTitle + ': ' + props.title}
    >
      <div class='pb-2 mb-3'>
        <button
          id='contentFormSaveButton'
          class='btn btn-warning'
          onclick='onContentFormSave()'
          disabled
        >
          {props.saveButtonText}
        </button>{' '}
      </div>

      <div id='formio'></div>
    </Layout>
  );
};












export const Form = (props: {
  title: string;
  screenTitle: string;
  saveButtonText: string;
  username?: string;
  env: Bindings;
}) => {
  return (
    <Layout
      env={props.env}
      username={props.username}
      screenTitle={props.screenTitle + ': ' + props.title}
    >
      <div class='pb-2 mb-3'>
        <button
          id='contentFormSaveButton'
          class='btn btn-warning'
          onclick='onContentFormSave()'
          disabled
        >
          {props.saveButtonText}
        </button>{' '}
      </div>
      <div id='formio'></div>
    </Layout>
  );
};
