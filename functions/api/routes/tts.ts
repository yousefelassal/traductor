import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { env } from 'hono/adapter'
import { PassThrough } from 'node:stream'

const schema = z.object({
    text: z.string(),
    lang: z.string()
})

const tts = new Hono()
.post('/', zValidator('form', schema), async (c) => {
    const { AZURE_TTS_KEY, AZURE_TTS_LOCATION } = env(c)
    const { text } = c.req.valid('form')
    const key = AZURE_TTS_KEY
    const region = AZURE_TTS_LOCATION
    const speechConfig = sdk.SpeechConfig.fromSubscription(key as string, region as string);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const audioStram = await new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(text, (result) => {
            const { audioData } = result
            synthesizer.close()

            const bufferStream = new PassThrough()
            bufferStream.end(Buffer.from(audioData))
            resolve(bufferStream)
        }, (err) => {
            console.log(err)
            synthesizer.close()
            reject(err)
        })
    })
    const response = new Response(audioStram as BodyInit, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'inline; filename="tts.mp3"'
            }
    })
    return response
})

export default tts