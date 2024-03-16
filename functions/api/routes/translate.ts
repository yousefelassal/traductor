import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { env } from 'hono/adapter'

const schema = z.object({
    text: z.string(),
})

const endpoint = "https://api.cognitive.microsofttranslator.com"

const translator = new Hono()
.post('/', zValidator('form', schema), async (c) => {
    const { AZURE_TRANSLATOR_KEY, AZURE_LOCATION } = env(c)
    const text = c.req.valid('form')
    const key = AZURE_TRANSLATOR_KEY
    const region = AZURE_LOCATION
    const url = `${endpoint}/translate?api-version=3.0&to=es`
    const body = [{ text }]
    const { data } = await axios.post(url, body, {
        headers: {
            'Ocp-Apim-Subscription-Key': key as string,
            'Ocp-Apim-Subscription-Region': region as string,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        }
    })
    return c.json({
        translation: data[0].translations[0].text
    })
})

export default translator