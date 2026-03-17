import type { Locale } from '@hysp/ui-kit'
import { localeLabels } from '@hysp/ui-kit'
import zhTW from './locales/zh-TW'
import en from './locales/en'

/** Recursively widen literal string types to `string` while keeping structure */
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>
}

export type Dictionary = DeepStringify<typeof zhTW>

export const locales: Record<Locale, Dictionary> = {
  'zh-TW': zhTW,
  en,
}

export { localeLabels }
export const defaultLocale: Locale = 'zh-TW'
export type { Locale }
