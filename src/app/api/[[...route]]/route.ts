import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handle } from 'hono/vercel'
import { Context, Next } from 'hono';
import { Variables, AppContext } from './../../../server';
import { AuthRequest, Session, User } from 'lucia';

import { authAPI } from './../../../admin/auth';
import { Bindings } from './../../../types/bindings';

import { initializeLucia } from './../../../auth/lucia';

export const runtime = 'edge'
export type Variables = {
  authRequest: AuthRequest;
  session?: Session;
  user?: User;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
// originaL // const app = new Hono().basePath('/api')
//ORIGINAL // app.use('/*', cors())
//CHEKEAR

export type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

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

//CORS
app.use(
  '/v1/*',
  cors({
    origin: (origin) => {
      return origin.indexOf('localhost') > 0 || origin.endsWith('.sonicjs.com')
        ? origin
        : 'https://blpt-cf.pages.dev';
    }
  })
);











//request Logging
app.use('*', async (ctx, next) => {
  if (ctx.req.path.indexOf('/admin') == 0 || ctx.req.path.indexOf('/v1') == 0) {
    log(ctx, { level: 'info', method: ctx.req.method, url: ctx.req.path });
  }
  await next();
});

//auth

app.onError((err, ctx) => {
  console.log(`SonicJs Error: ${err}`);
  log(ctx, { level: 'error', message: err });

  return ctx.text('SonicJs Error', 500);
});

app.get('/', async (ctx) => {
  return ctx.redirect('/admin');
});


//CHEKEAR



app.get('/hello', async (c) => {
  const start = performance.now()
  let greeting: string;

  const query = c.req.query('q');

  if (!query) {
    greeting = 'Hello from Cloudflare workers!';
  } else {
    greeting = `Hello ${query} from Cloudflare workers!`
  }

  const end = performance.now()
  const duration = end - start;
  console.log(`Req took ${duration.toFixed(4)} ms`)

  return c.json({
    message: `${greeting} (${duration.toFixed(4)} ms)`,
  });
})


//app.route('/v1/auth', authAPI);

export const GET = handle(app)
export default app as never