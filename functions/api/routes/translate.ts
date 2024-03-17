import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { v4 as uuidv4 } from 'uuid'
import { env } from 'hono/adapter'

const schema = z.object({
    text: z.string(),
    lang: z.string()
})

const endpoint = "https://api.cognitive.microsofttranslator.com"

const translator = new Hono()
.post('/', zValidator('form', schema), async (c) => {
    const { AZURE_TRANSLATOR_KEY, AZURE_LOCATION } = env(c)
    const { text, lang } = c.req.valid('form')
    const key = AZURE_TRANSLATOR_KEY
    const region = AZURE_LOCATION
    const url = `${endpoint}/translate?api-version=3.0&to=${lang}`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': key as string,
            'Ocp-Apim-Subscription-Region': region as string,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        body: JSON.stringify([{ text }])
    });
    const data = await response.json();
    return c.json({
        from_lang: data[0].detectedLanguage.language,
        translation: data[0].translations[0].text,
        to_lang: data[0].translations[0].to
    })
})

export default translator