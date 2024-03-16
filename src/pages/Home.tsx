import { InferResponseType, InferRequestType } from 'hono/client'
import { useTranslationStore } from '../../stores/translation'
import { useMutation } from '@tanstack/react-query'
import { client } from '../libs/utils'

const Home = () => {
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
      },
    })
    
  
    return (
      <div className="container mx-auto py-12 flex flex-col gap-2 items-center">
        <h1 className="text-3xl font-bold">Current Translation: {currentTranslation.translation} </h1>
        <button
          className="rounded-md px-2 py-1 border bg-black/10"
          onClick={() => {
            translateMutation.mutate({
              text: 'Hello world'
            })
          }}
        >
          Send translation
        </button>
  
        <div className="rounded-md border shadow-md">
          {allTranslations.map((translation, i) => (
            <div key={i}>
              <p>{translation.lang}</p>
              <p>{translation.translation}</p>
            </div>
          ))}
        </div>
      </div>
    )
}

export default Home