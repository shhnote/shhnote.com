import en from '../strings/en.json';
import { defaultLocale, type Locale } from './i18n';

export type Strings = typeof en;

type Deep = { [key: string]: string | Deep };

const files = import.meta.glob<{ default: Deep }>('../strings/*.json', { eager: true });

function merge(base: Deep, over: Deep | undefined): Deep {
  if (!over) return base;
  const out: Deep = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = base[k];
    out[k] = typeof v === 'object' && typeof b === 'object' ? merge(b, v) : v;
  }
  return out;
}

/** UI strings for a locale; keys missing from the locale fall back to `en`. */
export function getStrings(locale: Locale): Strings {
  if (locale === defaultLocale) return en;
  const file = files[`../strings/${locale}.json`];
  return merge(en as unknown as Deep, file?.default) as unknown as Strings;
}
