#!/usr/bin/env sh
# Renders the main repository's API documentation for this site.
#
# Reads `crates/shhnote-server/content/en/docs.md` at the tag in `.shhnote-ref`
# (`SHHNOTE_REF` overrides), fills its `{{placeholders}}` with this instance's
# values and writes `src/generated/docs.md` for the `docs` page to render.
#
# Source: the local checkout in `SHHNOTE_DIR` (default `../shhnote`) when it is a
# git repository, otherwise the file is downloaded from GitHub at that ref.
set -eu

here=$(cd "$(dirname "$0")/.." && pwd)
ref=${SHHNOTE_REF:-$(tr -d ' \n\r' < "$here/.shhnote-ref")}
dir=${SHHNOTE_DIR:-$here/../shhnote}
path=crates/shhnote-server/content/en/docs.md
out="$here/src/generated/docs.md"

site_url=https://shhnote.com
# The instance API root; the docs append /v1 themselves. It follows the API base the
# pages are built with: an absolute PUBLIC_SHH_API_BASE (the release build's, e.g.
# https://api.shhnote.com/v1) minus its /v1, otherwise this site's /api.
case ${PUBLIC_SHH_API_BASE:-} in
  http://*|https://*) api_url=${PUBLIC_SHH_API_BASE%/}; api_url=${api_url%/v1} ;;
  *) api_url=$site_url/api ;;
esac
project_url=https://github.com/shhnote/shhnote
spec_url=$project_url/blob/main/SPEC.md   # the server derives it the same way from its source URL
version=${ref#v}

if [ -z "$ref" ]; then
  echo "fetch-upstream: no ref; put a tag in .shhnote-ref or set SHHNOTE_REF" >&2
  exit 2
fi

tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT

if [ -d "$dir/.git" ]; then
  if ! git -C "$dir" show "$ref:$path" > "$tmp" 2>/dev/null; then
    echo "fetch-upstream: ref '$ref' or '$path' not found in $dir" >&2
    echo "fetch-upstream: run 'git -C $dir fetch --tags', or set SHHNOTE_REF" >&2
    exit 1
  fi
else
  url="https://raw.githubusercontent.com/shhnote/shhnote/$ref/$path"
  if ! curl -fsSL "$url" -o "$tmp"; then
    echo "fetch-upstream: could not download $url" >&2
    echo "fetch-upstream: check the ref in .shhnote-ref (or SHHNOTE_REF) and the network" >&2
    exit 1
  fi
fi

if [ ! -s "$tmp" ]; then
  echo "fetch-upstream: $path at $ref is empty" >&2
  exit 1
fi

mkdir -p "$(dirname "$out")"
{
  printf -- '---\nref: "%s"\n---\n' "$ref"
  sed -e "s#{{site_url}}#$site_url#g" \
      -e "s#{{api_url}}#$api_url#g" \
      -e "s#{{project_url}}#$project_url#g" \
      -e "s#{{spec_url}}#$spec_url#g" \
      -e "s#{{version}}#$version#g" "$tmp"
} > "$out"

if grep -q '{{' "$out"; then
  echo "fetch-upstream: unfilled placeholder in $path at $ref:" >&2
  grep -o '{{[^}]*}}' "$out" | sort -u >&2
  exit 1
fi

echo "fetch-upstream: rendered $path at $ref"
