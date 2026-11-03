export const locales = [
  'en',
  'de',
  'es',
  'fr',
  'nl',
  'hi',
  'ja',
  'pl',
  'zh',
  'el',
  'id',
  'ko',
  'pt',
  'sv',
  'he',
  'it',
  'ro',
  'tr',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

const rtl: ReadonlySet<Locale> = new Set<Locale>(['he']);

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): 'ltr' | 'rtl' {
  return rtl.has(locale) ? 'rtl' : 'ltr';
}
