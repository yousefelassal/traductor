import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { env } from 'hono/adapter'

const schema = z.object({
    id: z.string(),
    title: z.string(),
  })
  
type Todo = z.infer<typeof schema>
  
const todos: Todo[] = []

const test = new Hono()
  .post('/', zValidator('form', schema), (c) => {
    const todo = c.req.valid('form')
    todos.push(todo)
    return c.json({
      message: 'created!',
    })
  })
  .get('/', (c) => {
    return c.json({
        todos
    })
  })

export const Env = new Hono()
  .get('/', (c) => {
    const { VITE_TEST } = env(c) || import.meta.env.VITE_TEST
    return c.json({
      env: VITE_TEST
    })
  })

export default test