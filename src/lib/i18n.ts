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

/** Open Graph `og:locale` values (language_TERRITORY), one per locale. */
export const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  de: 'de_DE',
  es: 'es_ES',
  fr: 'fr_FR',
  nl: 'nl_NL',
  hi: 'hi_IN',
  ja: 'ja_JP',
  pl: 'pl_PL',
  zh: 'zh_CN',
  el: 'el_GR',
  id: 'id_ID',
  ko: 'ko_KR',
  pt: 'pt_PT',
  sv: 'sv_SE',
  he: 'he_IL',
  it: 'it_IT',
  ro: 'ro_RO',
  tr: 'tr_TR',
};

const rtl: ReadonlySet<Locale> = new Set<Locale>(['he']);

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): 'ltr' | 'rtl' {
  return rtl.has(locale) ? 'rtl' : 'ltr';
}
