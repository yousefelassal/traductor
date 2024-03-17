import { InferResponseType, InferRequestType } from 'hono/client'
import { useTranslationStore } from '../../stores/translation'
import { useMutation } from '@tanstack/react-query'
import { client } from '../libs/utils'
import { useForm, SubmitHandler } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'

type Input = {
    text: string | File
    lang: string

}

const TypingForm = () => {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = useForm<Input>()
    

    const {
        addTranslation,
        setCurrentTranslation
    } = useTranslationStore()
    
    const $postTts = client.api.tts.$post
    
    const ttsMutation = useMutation<
        InferResponseType<typeof $postTts>,
        Error,
        InferRequestType<typeof $postTts>['form']
    >({
        mutationFn: async (text) => {
          const res = await $postTts({
            form: text
          })
          return await res.blob()
        }
    })
      
    const $post = client.api.translate.$post
      
    const translateMutation = useMutation<
        InferResponseType<typeof $post>,
        Error,
        InferRequestType<typeof $post>['form']
    >({
        mutationFn: async (text) => {
          const res = await $post({
            form: text
          })
          return await res.json()
        },
        onSuccess(data) {
          reset( { text: '' } )
          ttsMutation.mutate({
            text: data.translation,
            lang: data.to_lang
        },{
            onSuccess: (dataTts) => {
              const url = URL.createObjectURL(dataTts as Blob)
              const audio = new Audio(url)
              const translation = {
                id: uuidv4().toString(),
                from_lang: data.from_lang,
                to_lang: data.to_lang,
                translation: data.translation,
                audio: audio
              }
              addTranslation(translation)
              setCurrentTranslation(translation)
              audio.currentTime = 0
              audio.onended = () => setCurrentTranslation(null)
              audio.play()
            }
          })
        },
      })
      
    const onSubmit: SubmitHandler<Input> = (data) => {
        translateMutation.mutate({
          text: data.text,
          lang: data.lang
        })
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="z-40 bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600/30 backdrop-blur-md rounded-lg border-slate-100/30 border px-4 lg:px-6 py-2 flex gap-2 md:justify-center fixed bottom-4 left-64 right-4 flex-wrap justify-stretch">
            <input
                type="text"
                {...register("text", { required: true })}
                placeholder="Enter text to translate"
                className="rounded-3xl border shadow px-3 py-2 flex-1 border-black/10"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md border shadow px-2 py-1 bg-black/10 hover:bg-black/20 transition-colors duration-200"
            >
                {isSubmitting ? "Translating..." : "Translate"}
            </button>
        </div>
        <div className="fixed top-2 left-64 right-4 rounded-md px-2 z-40 bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600/30 backdrop-blur-md border-slate-100/30 border py-2 flex inset-x-0 gap-2">
            <select
            {...register("lang", { required: true })}
            className="rounded-md border shadow px-2 py-1 border-black/10"
            >
            <option value="es">Spanish</option>
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="ar">Arabic</option>
            <option value="fr">French</option>
            <option value="it">Italian</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            </select>
        </div>
    </form>
  )
}

export default TypingForm