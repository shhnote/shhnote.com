# Contributing

This repository is one operator's website for the hosted shhnote instance at
shhnote.com. Changes to how secrets are encrypted, stored or revealed belong in
the main repository, https://github.com/shhnote/shhnote, not here.

## Translation review is welcome

English is the source, and every other language on the site was machine
translated and has not yet been reviewed by a native speaker
([docs/translations.md](docs/translations.md) lists them). If you read one of
them natively, corrections are very welcome, from a single word to a whole page.

Where the text lives, for a language code `xx`:

- `src/strings/xx.json`: the interface (navigation, the create form, the reveal,
  burn and report pages, error messages). Same keys as `src/strings/en.json`.
- `src/content/xx/*.md`: the content pages (how it works, security, FAQ, about,
  contact, terms, privacy, acceptable use).

When you change a translation:

- Keep the keys, the HTML tags and their attributes exactly as they are; change
  only the text. Keep placeholders such as `{period}` and `{ref}`, and the
  bracketed operator placeholders (`[date]`, `[number]`) in English.
- Keep links pointing at the same language (`/xx/...`), except `/en/docs/`.
- Use one word for each product term throughout a language (secret, one-time
  view, burn link, passphrase), and say in your pull request if you change one.
- Don't add claims the English doesn't make. If the English is wrong or unclear,
  open an issue about the English instead.

How to propose a fix:

1. Open a pull request with the change, or, if you'd rather not use git, an
   issue quoting the current text, your suggestion and the page's address.
2. Say which language you read natively; reviewed languages are marked as such
   in `docs/translations.md`.

To check your change locally: `npm ci`, then `npm run build` and
`scripts/check-external.sh`.

## Other changes

Bug reports about the site (layout, broken links, accessibility) are welcome as
issues. The site makes no request to any origin but its own and the instance's
API host, and uses no inline
scripts or styles; changes that would break that can't be accepted. Security
issues: see [SECURITY.md](SECURITY.md) and don't open a public issue.
