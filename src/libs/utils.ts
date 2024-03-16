import { AppType } from '../../functions/api/[[route]]'
import { hc } from 'hono/client'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
export const client = hc<AppType>('/')
