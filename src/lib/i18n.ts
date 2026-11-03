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

/** Locales that have pages built; the switcher links only to these. */
export const availableLocales: readonly Locale[] = [
  'en',
  'de',
  ...(['es', 'fr', 'nl', 'hi'] as const),
  ...(['ja', 'pl', 'zh', 'el'] as const),
  ...(['id', 'ko', 'pt', 'sv'] as const),
  ...(['he', 'it', 'ro', 'tr'] as const),
];

/** Each language in its own name, for the switcher. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  nl: 'Nederlands',
  hi: 'हिन्दी',
  ja: '日本語',
  pl: 'Polski',
  zh: '中文',
  el: 'Ελληνικά',
  id: 'Bahasa Indonesia',
  ko: '한국어',
  pt: 'Português',
  sv: 'Svenska',
  he: 'עברית',
  it: 'Italiano',
  ro: 'Română',
  tr: 'Türkçe',
};

const rtl: ReadonlySet<Locale> = new Set<Locale>(['he']);

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): 'ltr' | 'rtl' {
  return rtl.has(locale) ? 'rtl' : 'ltr';
}
