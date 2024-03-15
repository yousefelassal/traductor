import { Hono } from 'hono'
// import { z } from 'zod'
// import { zValidator } from '@hono/zod-validator'

// const schema = z.object({
//     id: z.string(),
//     title: z.string(),
// })
  
const Env = new Hono()
.get('/', (c) => {
    const TEST = process.env.TEST
    return c.json({
        env: TEST
    })
})

export default Env