import { AppType } from '../../functions/api/[[route]]'
import { hc } from 'hono/client'
import { QueryClient } from '@tanstack/react-query'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const queryClient = new QueryClient()
export const client = hc<AppType>('/')
