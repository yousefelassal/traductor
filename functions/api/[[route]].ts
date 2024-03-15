import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import test from './routes/test'
import Env from './routes/translate'

const app = new Hono()
  .basePath('/api')
  .route('/todo', test)
  .route('/env', Env)

export type AppType = typeof app

export const onRequest = handle(app)