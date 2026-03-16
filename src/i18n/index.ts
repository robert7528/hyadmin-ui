import zhTW from './locales/zh-TW'
import en from './locales/en'

export type Locale = 'zh-TW' | 'en'
export type Dictionary = typeof zhTW

export const locales: Record<Locale, Dictionary> = {
  'zh-TW': zhTW,
  en,
}

export const localeLabels: Record<Locale, string> = {
  'zh-TW': '繁體中文',
  en: 'English',
}

export const defaultLocale: Locale = 'zh-TW'
