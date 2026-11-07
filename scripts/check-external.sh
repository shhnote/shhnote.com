#!/usr/bin/env sh
# Fails if the built site references any http(s) URL outside the allow-list.
# The site makes no request to any origin but its own and the instance's API;
# the only URLs that may appear are links to the project's own domains and its
# GitHub organisation, and the API base the build was given.
#
# The API: when `PUBLIC_SHH_API_BASE` is an absolute URL (the release build
# sets it from the repository's Actions variable), URLs on exactly that origin
# (scheme, host and port) are allowed in every file. Run this with the same
# value the build had; a relative base (the default `/api/v1`) adds nothing.
#
# The one exception: the comparison pages (`<locale>/compare/`) cite the public
# pages of the services they compare (docs/compare-sources.md). Those citation
# links are allowed in files under `$dist/*/compare/` only; every other file is
# held to the strict list.
set -eu

dist="${1:-dist}"

if [ ! -d "$dist" ]; then
  echo "check-external: $dist does not exist; run the build first" >&2
  exit 2
fi

# host[/path-prefix] entries; a URL passes when it starts with one of them.
# The last two are XML namespace identifiers (the SVG favicon, the sitemap), not
# addresses anything is fetched from.
allow='(shhnote\.com|shhnote\.org|github\.com/shhnote|www\.w3\.org/2000/svg|www\.sitemaps\.org/schemas/sitemap/0\.9)'

# Citation sources, allowed on the compare pages only. Keep in step with
# docs/compare-sources.md.
cite='(github\.com/onetimesecret/onetimesecret|privatebin\.info|github\.com/PrivateBin/PrivateBin|github\.com/jhaals/yopass|github\.com/pglombardo/PasswordPusher|eu\.pwpush\.com|bitwarden\.com/products/send|bitwarden\.com/help/about-send|support\.1password\.com/share-items|github\.com/pinterest/snappass)'

url_re='https?://[^"'"'"' <>)]+'
end='([/?#"]|$)'

found=$(grep -rEo "$url_re" "$dist" | grep -Ev "^[^:]+:https?://(www\.)?$allow$end" || true)

# Drop URLs on the API origin, if the build was given an absolute API base.
api_origin=$(printf '%s' "${PUBLIC_SHH_API_BASE:-}" | sed -nE 's#^(https?://[^/?#]+).*#\1#p')
if [ -n "$api_origin" ]; then
  api_re=$(printf '%s' "$api_origin" | sed 's/[.[\*^$+?(){}|]/\\&/g')
  found=$(printf '%s\n' "$found" | grep -Ev "^[^:]+:$api_re$end" || true)
  echo "check-external: allowing the API origin $api_origin"
fi

# Drop citation links in compare pages; anything else stays an error.
found=$(printf '%s\n' "$found" | grep -Ev "^$dist/[^/]+/compare/[^:]*:https?://(www\.)?$cite$end" || true)

if [ -n "$found" ]; then
  echo "check-external: external URLs found in $dist:" >&2
  echo "$found" >&2
  exit 1
fi

echo "check-external: ok, no external URLs in $dist outside the allow-list"
