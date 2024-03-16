import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppType } from '../functions/api/[[route]]'
import { hc, InferResponseType, InferRequestType } from 'hono/client'
import { useTranslationStore } from '../stores/translation'

const queryClient = new QueryClient()
const client = hc<AppType>('/')

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

const Todos = () => {
  const {
    allTranslations,
    currentTranslation,
    addTranslation,
    setCurrentTranslation
  } = useTranslationStore()

  const { data, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await client.api.todo.$get()
      return await res.json()
    }
  })

  const $post = client.api.todo.$post
  
  const $postTranslate = client.api.translate.$post
  
  const translateMutation = useMutation<
    InferResponseType<typeof $postTranslate>,
    Error,
    InferRequestType<typeof $postTranslate>['form']
  >({
    mutationFn: async (text) => {
      const res = await $postTranslate({
        form: text
      })
      return await res.json()
    },
    onSuccess(data) {
      addTranslation(data)
      setCurrentTranslation(data)
    },
  })
  
  const mutation = useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>['form']
  >({
    mutationFn: async (todo) => {
      const res = await $post({
        form: todo,
      })
      return await res.json()
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      console.log(error)
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-12 flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold">Current Translation: {currentTranslation.translation} </h1>
      <button
        className="rounded-md px-2 py-1 border bg-black/10"
        onClick={() => {
          mutation.mutate({
            id: Date.now().toString(),
            title: 'Write code',
          })
        }}
      >
        Add Todo
      </button>
      
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

      <ul className="list-disc">
        {data?.todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

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
