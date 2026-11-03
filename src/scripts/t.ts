import type { Translate, UiKey } from '@shhnote/client/ui';

// The `t` the controllers take, built from the page's `data-shh-i18n` block (written by
// the layout from the locale JSON, see `uiStrings` in src/lib/strings.ts). Same `{name}`
// substitution as the reference frontend.
let strings: Partial<Record<UiKey, string>> | null = null;

export const t: Translate = (key, vars = {}) => {
  if (strings === null) {
    const block = document.querySelector<HTMLScriptElement>('script[data-shh-i18n]');
    try {
      strings = block ? (JSON.parse(block.textContent ?? '{}') as Record<UiKey, string>) : {};
    } catch {
      strings = {};
    }
  }
  let text = strings[key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
};
