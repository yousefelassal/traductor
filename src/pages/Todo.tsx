import { useQuery, useMutation } from '@tanstack/react-query'
import { client, queryClient } from '../libs/utils'
import { InferResponseType, InferRequestType } from 'hono/client'

const Todos = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await client.api.todo.$get()
      return await res.json()
    }
  })

  const $post = client.api.todo.$post
  
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

      <ul className="list-disc">
        {data?.todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default Todos