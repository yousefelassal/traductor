import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import test from './routes/test'

const app = new Hono()
  .basePath('/api')
  .route('/todo', test)

export type AppType = typeof app

export const onRequest = handle(app)