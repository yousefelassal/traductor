import { Hono } from 'hono'
import { env } from 'hono/adapter'
// import { z } from 'zod'
// import { zValidator } from '@hono/zod-validator'

// const schema = z.object({
//     id: z.string(),
//     title: z.string(),
// })
  
const Env = new Hono()
  .get('/', (c) => {
    const { VITE_TEST } = env(c)
    return c.json({
      env: VITE_TEST
    })
  })

export default Env