import { AppType } from '../../functions/api/[[route]]'
import { hc } from 'hono/client'
import { QueryClient } from '@tanstack/react-query'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertLangCode = (code: string) => {
  const lang = new Intl.DisplayNames(['en'], { type: 'language' });
  return lang.of(code)
}

export const convertLangToFlag = (code: string) => {
  switch (code) {
    case 'en':
      return 'GB'
    case 'es':
      return 'ES'
    case 'fr':
      return 'FR'
    case 'it':
      return 'IT'
    case 'pt':
      return 'PT'
    case 'ru':
      return 'RU'
    case 'ja':
      return 'JP'
    case 'ko':
      return 'KR'
    case 'ar':
      return 'SA'
    case 'de':
      return 'DE'
    default:
      return ''
  }
}

export const queryClient = new QueryClient()
export const client = hc<AppType>('/')
