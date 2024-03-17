import { InferResponseType, InferRequestType } from 'hono/client'
import { useTranslationStore } from '../../stores/translation'
import { useMutation } from '@tanstack/react-query'
import { client } from '../libs/utils'
import { useForm, SubmitHandler } from "react-hook-form"
import { useAutoAnimate } from '@formkit/auto-animate/react'

type Input = {
  text: string | File
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
    translateMutation.mutate({ text: data.text })
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
            <p>{translation.lang}</p>
            <p>{translation.translation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home