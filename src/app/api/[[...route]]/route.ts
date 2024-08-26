import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { api } from './../../../api/cms/api/api';
import { authAPI } from './../../../api/cms/admin/auth';
import { admin } from './../../../api/cms/admin/admin';
import { status } from './../../../api/cms/api/status';
import { log } from './../../../api/cms/util/logger';
import { tusAPI } from './../../../api/cms/api/tus';
import { initializeLucia } from './../../../api/cms/auth/lucia';
import { Bindings } from './../../../api/cms/types/bindings';
import { AuthRequest, Session, User } from 'lucia';

export const runtime = 'edge';
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().basePath('/api');

export type Variables = {
  authRequest: AuthRequest;
  session?: Session;
  user?: User;
};

export type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

// Middleware para manejo de autenticación y sesiones
app.use('*', async (ctx, next) => {
  const path = ctx.req.path;
  if (!path.includes('/public')) {
    const auth = initializeLucia(ctx.env.D1DATA, ctx.env);
    const authRequest = auth.handleRequest(ctx);
    let session = await authRequest.validate();
    if (!session) {
      session = await authRequest.validateBearerToken();
    }
    if (session?.user?.userId) {
      ctx.set('user', session.user);
    }

    authRequest.setSession(session);

    ctx.set('authRequest', authRequest);
    ctx.set('session', session);
  }
  await next();
});

// CORS para rutas /v1/*
app.use(
  '/v1/*',
  cors({
    origin: (origin) => {
      return origin.indexOf('localhost') > 0 || origin.endsWith('.sonicjs.com')
        ? origin
        : 'https://blpt-cf.pages.dev';
    },
  })
);

// Middleware para logging de solicitudes
app.use('*', async (ctx, next) => {
  if (ctx.req.path.startsWith('/admin') || ctx.req.path.startsWith('/v1')) {
    log(ctx, { level: 'info', method: ctx.req.method, url: ctx.req.path });
  }
  await next();
});

// Manejo de errores
app.onError((err, ctx) => {
  console.log(`SonicJs Error: ${err}`);
  log(ctx, { level: 'error', message: err });

  return ctx.text('SonicJs Error', 500);
});

// Ruta raíz para redirigir a /admin
app.get('/', async (ctx) => {
  return ctx.redirect('/admin');
});

// Ruta para servir recursos públicos
app.get('/public/*', async (ctx) => {
  return await ctx.env.ASSETS.fetch(ctx.req.raw);
});

// Rutas definidas en diferentes módulos
app.route('/v1', api);
app.route('/v1/auth', authAPI);
app.route('/admin', admin);
app.route('/status', status);
app.route('/tus', tusAPI);

export const GET = handle(app);
export default app as never;
