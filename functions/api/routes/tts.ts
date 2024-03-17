import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { env } from 'hono/adapter'

const schema = z.object({
    text: z.string(),
    lang: z.string()
})

const tts = new Hono()
.post('/', zValidator('form', schema), async (c) => {
    const { AZURE_TTS_KEY, AZURE_TTS_LOCATION } = env(c)
    const { text, lang } = c.req.valid('form')
    const key = AZURE_TTS_KEY
    const region = AZURE_TTS_LOCATION
    const spokenLang = lang === 'en' ? 'en-GB'
    : lang === 'es' ? 'es-ES'
    : lang === 'fr' ? 'fr-FR'
    : lang === 'de' ? 'de-DE'
    : lang === 'it' ? 'it-IT'
    : lang === 'ja' ? 'ja-JP'
    : lang === 'ko' ? 'ko-KR'
    : lang === 'pt' ? 'pt-PT'
    : lang === 'ru' ? 'ru-RU'
    : lang === 'ar' ? 'ar-EG'
    : 'en-GB'
    const speechConfig = sdk.SpeechConfig.fromSubscription(key as string, region as string);
    speechConfig.speechSynthesisLanguage = spokenLang
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const audioStram = await new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(text, (result) => {
            const { audioData } = result
            synthesizer.close()
            resolve(audioData)
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