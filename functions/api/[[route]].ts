import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import test from './routes/test'
import { Env } from './routes/test'
import translator from './routes/translate'

const app = new Hono()
  .basePath('/api')
  .route('/todo', test)
  .route('/env', Env)
  .route('/translate', translator)

export type AppType = typeof app

export const onRequest = handle(app)