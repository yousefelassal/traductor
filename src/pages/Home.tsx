import { InferResponseType, InferRequestType } from 'hono/client'
import { useTranslationStore } from '../../stores/translation'
import { useMutation } from '@tanstack/react-query'
import { client } from '../libs/utils'
import { useForm, SubmitHandler } from "react-hook-form"
import { useAutoAnimate } from '@formkit/auto-animate/react'

type Input = {
  text: string | File
  lang: string
}

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Input>()

  const [animationParent] = useAutoAnimate()

  const {
    allTranslations,
    currentTranslation,
    addTranslation,
    setCurrentTranslation
  } = useTranslationStore()
  
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
      addTranslation(data)
      setCurrentTranslation(data)
      reset()
    },
  })
  
  const onSubmit: SubmitHandler<Input> = (data) => {
    translateMutation.mutate({
      text: data.text,
      lang: data.lang
    })
  }

  const convertLangCode = (code: string) => {
    const lang = new Intl.DisplayNames(['en'], { type: 'language' });
    return lang.of(code)
  }

  return (
    <div className="container mx-auto py-12 flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold">Current Translation: {currentTranslation.translation} </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <input
          type="text"
          {...register("text", { required: true })}
          placeholder="Enter text to translate"
          className="rounded-md border shadow px-2 py-1 border-black/10"
        />
        {errors.text && <span>This field is required</span>}
        <select
          {...register("lang", { required: true })}
          className="rounded-md border shadow px-2 py-1 border-black/10"
        >
          <option value="es">Spanish</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="it">Italian</option>
          <option value="de">German</option>
          <option value="pt">Portuguese</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
        </select>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border shadow px-2 py-1 bg-black/10 hover:bg-black/20 transition-colors duration-200"
        >
          {isSubmitting ? "Translating..." : "Translate"}
        </button>
      </form>

      <div
        ref={animationParent}
        className="flex flex-col gap-1"
      >
        {allTranslations.map((translation, i) => (
          <div key={i} className="rounded-md border shadow-md">
            <p>from: {convertLangCode(translation.from_lang)}</p>
            <p>to: {convertLangCode(translation.to_lang)}</p>
            <p>{translation.translation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home