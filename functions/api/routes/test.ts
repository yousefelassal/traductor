import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { env } from 'hono/adapter'
import { db } from '../db'

const schema = z.object({
  id: z.string(),
  title: z.string(),
})

const test = new Hono()
  .post('/', zValidator('form', schema), async (c) => {
    const todo = c.req.valid('form')
    await db.test.create({ data: todo })
    return c.json({
        todo
    })
  })
  .get('/', async (c) => {
    const todos = await db.test.findMany()
    return c.json({
        todos
    })
  })

export const Env = new Hono()
  .get('/', (c) => {
    const { TEST } = env(c) 
    return c.json({
      env: TEST
    })
  })

export default test