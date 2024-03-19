import { InferResponseType, InferRequestType } from 'hono/client'
import { useTranslationStore } from '../../stores/translation'
import { useMutation } from '@tanstack/react-query'
import { client } from '../lib/utils'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  LanguageIcon,
  Bars3Icon 
} from '@heroicons/react/24/solid'
import { useMediaQuery } from '@uidotdev/usehooks'
import useNavStore from '../../stores/nav'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Input } from './ui/input'

const formSchema = z.object({
  text: z.string({
    required_error: 'Text is required'
  }),
  lang: z.string()
})

const TypingForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lang: 'es'
    }
  })
  const isSmallDevice = useMediaQuery('only screen and (max-width: 768px)')
  const { toggle } = useNavStore()
    
    const {
        addTranslation,
        setCurrentTranslation,
        setCurrentAudio,
        loading,
        setLoading,
        setIsPronouncing
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
                text: form.getValues().text as string
              }
              form.reset( { text: '' } )
              addTranslation(translation)
              setCurrentTranslation(translation)
              audio.onplay = () => {
                setCurrentAudio(audioObject)
                setIsPronouncing(true)
              }
              audio.onended = () => {
                setCurrentAudio(null)
                setIsPronouncing(false)
              }
              audio.play()
            },
            onSettled: () => setLoading(false)
          })
        },
      })
      
    const onSubmit = (data: z.infer<typeof formSchema>) => {
      if(data.text)
        translateMutation.mutate({
          text: data.text,
          lang: data.lang
        })
    }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="z-40 bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600/30 backdrop-blur-md rounded-lg border-purple-400/30 border px-4 lg:px-6 py-2 flex gap-2 md:justify-center fixed bottom-4 left-4 md:left-64 right-4 flex-wrap justify-stretch">
          <FormField
            control={form.control}
            name="text"
            render={({field}) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter text to translate"
                    className="rounded-3xl border text-[16px] w-full shadow px-3 py-2 flex-1 bg-white/80 text-black border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
            <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="group rounded-full border shadow px-2 py-1 bg-white/80 hover:bg-black/20 transition-colors duration-200"
            >
              {loading ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : 
                <PaperAirplaneIcon className="w-6 h-6 -rotate-90 fill-purple-900/60 group-hover:fill-white transition-all duration-200" />
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
            <FormField
              control={form.control}
              name="lang"
              render={({field}) => (
                <FormItem>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="rounded-md border shadow px-2 py-1 border-black/10"
                  >
                    <SelectValue placeholder="Select language"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                  </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
    </form>
  </Form>
  )
}

export default TypingForm