#!/usr/bin/env sh
# Fails if the built site references any http(s) URL outside the allow-list.
# The site makes no request to any origin but its own; the only URLs that may
# appear are links to the project's own domains and its GitHub organisation.
set -eu

dist="${1:-dist}"

if [ ! -d "$dist" ]; then
  echo "check-external: $dist does not exist; run the build first" >&2
  exit 2
fi

# host[/path-prefix] entries; a URL passes when it starts with one of them.
# The last two are XML namespace identifiers (the SVG favicon, the sitemap), not
# addresses anything is fetched from.
allow='https?://(www\.)?(shhnote\.com|shhnote\.org|github\.com/shhnote|www\.w3\.org/2000/svg|www\.sitemaps\.org/schemas/sitemap/0\.9)([/?#"]|$)'

found=$(grep -rEo 'https?://[^"'"'"' <>)]+' "$dist" | grep -Ev "^[^:]+:$allow" || true)

if [ -n "$found" ]; then
  echo "check-external: external URLs found in $dist:" >&2
  echo "$found" >&2
  exit 1
fi

echo "check-external: ok, no external URLs in $dist"
