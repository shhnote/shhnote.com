# Translations

`en` is the source: `src/strings/en.json` and `src/content/en/*.md`. Every other
locale has the same files under its own code. A key missing from a locale's JSON
falls back to English, so a partial update never breaks a page.

Every translation below was made by an AI model on 2026-11-03, and brought in step
with the English copy corrections of 2026-11-05 (claims about logs, lifetimes, TLS and
storage, the Tor level, the files limit from `/config`, the privacy policy's log section
and the policy dates); none has **yet been reviewed by a native speaker**. Corrections
are welcome; see `CONTRIBUTING.md`.

What is not translated, on purpose:

- the API documentation (`/en/docs/`), rendered from the main repository in English;
- the Open Graph image (`/og.png`), one English card for every locale.

The setup notice (`setup` in the strings, added 2026-11-07; shown when the instance has
not finished setup) is English in every locale except `de`, which takes the main
repository's `locales/de/main.ftl` wording; the others fall back to `en` until they
are translated.

The operator placeholders in the policy pages (the date, the reply time, the server-log
section) were filled on 2026-11-05 in every language.

The policy pages (`terms`, `privacy`, `acceptable-use`) carry a note in each language
that the English version is authoritative (`content.translationNote` in the strings).

| locale | language | source | address form | date | status |
|---|---|---|---|---|---|
| `de` | Deutsch | UI strings: the main repository's `locales/de/main.ftl` (v0.3.0) where a key matches, the rest translated from `en`. Pages: `terms`, `privacy`, `acceptable-use` and the last section of `security` reuse the main repository's `content/de/*.md` wording where the English matches; the rest translated from `en`. | du | 2026-11-05 | machine translation, pending review |
| `es` | Español | Translated from `en` | tú | 2026-11-05 | machine translation, pending review |
| `fr` | Français | Translated from `en` | vous | 2026-11-05 | machine translation, pending review |
| `nl` | Nederlands | Translated from `en` | je/jij | 2026-11-05 | machine translation, pending review |
| `hi` | हिन्दी | Translated from `en` | आप | 2026-11-05 | machine translation, pending review |
| `ja` | 日本語 | Translated from `en` | です/ます | 2026-11-05 | machine translation, pending review |
| `pl` | Polski | Translated from `en` | ty | 2026-11-05 | machine translation, pending review |
| `zh` | 中文 (简体) | Translated from `en` | 你 | 2026-11-05 | machine translation, pending review |
| `el` | Ελληνικά | Translated from `en` | εσείς | 2026-11-05 | machine translation, pending review |
| `id` | Bahasa Indonesia | Translated from `en` | Anda | 2026-11-05 | machine translation, pending review |
| `ko` | 한국어 | Translated from `en` | 해요체; 합니다체 on the policy pages | 2026-11-05 | machine translation, pending review |
| `pt` | Português (Brasil) | Translated from `en` | você | 2026-11-05 | machine translation, pending review |
| `sv` | Svenska | Translated from `en` | du | 2026-11-05 | machine translation, pending review |
| `he` | עברית | Translated from `en` | plural / impersonal (gender-neutral) | 2026-11-05 | machine translation, pending review |
| `it` | Italiano | Translated from `en` | tu | 2026-11-05 | machine translation, pending review |
| `ro` | Română | Translated from `en` | tu | 2026-11-05 | machine translation, pending review |
| `tr` | Türkçe | Translated from `en` | siz | 2026-11-05 | machine translation, pending review |

## Choices a reviewer should look at first

- **Tor Browser security levels.** The "Safer" level is named from memory of Tor
  Browser's own localisation (`de` Sicherer, `es` Más seguro, `fr` Plus sûr, `nl`
  Veiliger, `ja` より安全, `zh` 更安全, `pl` Bezpieczniejszy, `pt` Mais seguro, `it` Più
  sicuro, `ro` Mai sigur, `tr` Daha güvenli, `sv` Säkrare, `he` בטוח יותר), unverified;
  `el`, `hi`, `id` and `ko` keep the English name in quotes. A reviewer with Tor Browser
  in that language should confirm the exact string.
- **"Passphrase".** `pl`, `pt` and `he` use the ordinary word for password (hasło,
  senha, סיסמה) for both password and passphrase, consistently; the English itself
  mixes the two (the field hint says "password", the label "passphrase"), and the field
  accepts any string, so this was kept on 2026-11-05 rather than introducing a second
  term. The `he` form label still shows both.
- **Expiry wording.** Each locale chose `home.form.expiryLabel`, the duration labels
  and `ui.result-chip-expires` so that both the dropdown and the "expires in" chip
  read correctly (`hi` uses "समाप्ति: {period}", `ja`/`ko`/`tr` put the duration first).
- **`zh` term for "secret"**: 密信; an alternative is 秘密.
