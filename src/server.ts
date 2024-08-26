import { Bindings } from '../types/bindings';
import { AuthRequest, Session, User } from 'lucia';
import { Context, Next } from 'hono';


export type Variables = {
  authRequest: AuthRequest;
  session?: Session;
  user?: User;
};
export type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;