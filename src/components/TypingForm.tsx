import { InferResponseType, InferRequestType } from 'hono/client'
import { useTranslationStore } from '../../stores/translation'
import { useMutation } from '@tanstack/react-query'
import { client } from '../libs/utils'
import { useForm, SubmitHandler } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  LanguageIcon,
  Bars3Icon 
} from '@heroicons/react/24/solid'
import { useMediaQuery } from '@uidotdev/usehooks'
import useNavStore from '../../stores/nav'

type Input = {
    text: string | File
    lang: string

}

const TypingForm = () => {
  const {
      register,
      handleSubmit,
      formState: { isSubmitting },
      reset,
      getValues
  } = useForm<Input>()
  const isSmallDevice = useMediaQuery('only screen and (max-width: 768px)')
  const { toggle } = useNavStore()
    
    const {
        addTranslation,
        setCurrentTranslation,
        setCurrentAudio,
        loading,
        setLoading
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
          setLoading(true)
          const res = await $post({
            form: text
          })
          return await res.json()
        },
        onSuccess(data) {
          ttsMutation.mutate({
            text: data.translation,
            lang: data.to_lang
          },
          {
            onSuccess: (dataTts) => {
              const url = URL.createObjectURL(dataTts as Blob)
              const audio = new Audio(url)
              const id = uuidv4().toString()
              const audioObject = {
                id: id,
                audio: audio
              }
              const translation = {
                id: id,
                from_lang: data.from_lang,
                to_lang: data.to_lang,
                translation: data.translation,
                audio: audioObject,
                audioUrl: url,
                text: getValues().text as string
              }
              reset( { text: '' } )
              addTranslation(translation)
              setCurrentTranslation(translation)
              audio.onplay = () => setCurrentAudio(audioObject)
              audio.onended = () => setCurrentAudio(null)
              audio.play()
            },
            onSettled: () => setLoading(false)
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
        <div className="z-40 bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600/30 backdrop-blur-md rounded-lg border-purple-400/30 border px-4 lg:px-6 py-2 flex gap-2 md:justify-center fixed bottom-4 left-4 md:left-64 right-4 flex-wrap justify-stretch">
            <input
                type="text"
                {...register("text", { required: true })}
                placeholder="Enter text to translate"
                className="rounded-3xl border shadow px-3 py-2 flex-1 bg-white/80 text-black border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="group rounded-full border shadow px-2 py-1 bg-white/80 hover:bg-black/20 transition-colors duration-200"
            >
              {loading ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : 
                <PaperAirplaneIcon className="w-6 h-6 -rotate-90 group-hover:fill-white transition-all duration-200" />
              }
            </button>
        </div>
        <div className="fixed justify-between items-center top-2 left-4 md:left-64 right-4 rounded-md px-2 z-40 bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600/30 backdrop-blur-md border-violet-300/30 border py-2 flex inset-x-0 gap-2">
          {isSmallDevice && (
            <div
              onClick={toggle}
              className="rounded-full hover:cursor-pointer flex w-fit items-center justify-center border shadow p-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
            >
              <Bars3Icon className="w-6 h-6 fill-white/90" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <LanguageIcon className="w-6 h-6 text-white/90" />
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
        </div>
    </form>
  )
}

export default TypingForm