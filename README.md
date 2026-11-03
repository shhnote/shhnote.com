# shhnote.com

The public website of the hosted [shhnote](https://github.com/shhnote/shhnote)
instance at https://shhnote.com: a static site built with Astro. The pages are
this site's own; the secret-sharing behaviour comes from the `@shhnote/client`
package, and the API it talks to is the shhnote server running behind the same
origin at `/api/v1`.

The site makes no request to any origin but its own: fonts, styles, scripts and
the Argon2 module are served from here, and there is no analytics. A build fails
if an external URL slips into the output.

## Local development

You need Node.js 22 or later, a checkout of the main repository next to this one
(`../shhnote`, used to render the API documentation at the tag in
`.shhnote-ref`), and a local shhnote instance in `api` mode:

```
npm ci
# a local shhnote instance in api mode on http://localhost:3000, setup gate cleared
PUBLIC_SHH_API_BASE=http://localhost:3000/api/v1 npm run dev
npm run build && scripts/check-external.sh
```

`npm run build` renders the documentation first (`scripts/fetch-upstream.sh`;
`SHHNOTE_REF` overrides the pinned tag) and writes the site to `dist/`.

## Licence

Code: AGPL-3.0-only (LICENSE). Content, design and brand: all rights
reserved (LICENSE-CONTENT). The shhnote name and logo may not be used for
another instance.
