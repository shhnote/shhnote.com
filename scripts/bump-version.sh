#!/usr/bin/env bash
# Bump the frontend version, commit, and tag, so a push publishes a release.
#
#   scripts/bump-version.sh patch|minor|major     next stable version
#   scripts/bump-version.sh rc                    next pre-release of the next minor
#                                                 (0.1.0 -> 0.2.0-rc.1, 0.2.0-rc.1 -> 0.2.0-rc.2)
#   scripts/bump-version.sh release               drop the pre-release suffix (0.2.0-rc.2 -> 0.2.0)
#   scripts/bump-version.sh 1.2.3                 set an exact version
#   scripts/bump-version.sh tag                   tag the version package.json already carries
#                                                 (after a bump made by hand)
#   scripts/bump-version.sh <mode> --yes          skip the confirmation prompt
#
# Preconditions: on main, clean working tree, not behind origin/main, the scripts
# executable in git, and package.json and package-lock.json agree on the version. Writes
# the new version to both files (`npm version`, no git side effects), commits as
# "release: <version>" and creates the signed tag v<version>. The release workflow
# (.github/workflows/release.yml) builds that tag and refuses one that does not match
# package.json. Push with:
#   git push origin main --follow-tags
set -euo pipefail
cd "$(dirname "$0")/.."

mode="${1:-}"; yes="${2:-}"
[ -n "$mode" ] || { sed -n '2,19p' "$0"; exit 2; }

# ---- preconditions -------------------------------------------------------------------
branch=$(git rev-parse --abbrev-ref HEAD)
[ "$branch" = "main" ] || { echo "on '$branch'; releases are cut from main" >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "working tree not clean" >&2; exit 1; }
git fetch --quiet origin main
behind=$(git rev-list --count HEAD..origin/main)
[ "$behind" = 0 ] || { echo "main is $behind commit(s) behind origin/main; pull first" >&2; exit 1; }

bad=$(git ls-files -s scripts/ | awk '$1 != "100755" {print $4}')
[ -z "$bad" ] || { echo "not executable in git (git update-index --chmod=+x <file>):" >&2; echo "$bad" >&2; exit 1; }

pkg_v=$(node -p "require('./package.json').version")
lock_v=$(node -p "require('./package-lock.json').version")
lock_root_v=$(node -p "require('./package-lock.json').packages[''].version")
if [ "$pkg_v" != "$lock_v" ] || [ "$pkg_v" != "$lock_root_v" ]; then
  echo "versions disagree: package.json=$pkg_v package-lock.json=$lock_v/$lock_root_v" >&2
  exit 1
fi
current="$pkg_v"
git rev-parse -q --verify "refs/tags/v$current" >/dev/null && tagged="(tagged)" || tagged="(not tagged)"

# ---- next version --------------------------------------------------------------------
if [ "$mode" = "tag" ]; then
  next="$current"
else
next=$(python3 - "$current" "$mode" <<'PY'
import re, sys
cur, mode = sys.argv[1], sys.argv[2]
m = re.fullmatch(r"(\d+)\.(\d+)\.(\d+)(?:-rc\.(\d+))?", cur)
if not m:
    sys.exit(f"cannot parse current version {cur!r}")
major, minor, patch, rc = (int(x) if x else None for x in m.groups())
if re.fullmatch(r"\d+\.\d+\.\d+(-rc\.\d+)?", mode):
    print(mode)
elif mode == "patch":
    print(f"{major}.{minor}.{patch + 1}" if rc is None else f"{major}.{minor}.{patch}")
elif mode == "minor":
    print(f"{major}.{minor + 1}.0" if rc is None else f"{major}.{minor}.{patch}")
elif mode == "major":
    print(f"{major + 1}.0.0")
elif mode == "rc":
    print(f"{major}.{minor}.{patch}-rc.{rc + 1}" if rc is not None else f"{major}.{minor + 1}.0-rc.1")
elif mode == "release":
    if rc is None:
        sys.exit(f"{cur} is not a pre-release")
    print(f"{major}.{minor}.{patch}")
else:
    sys.exit(f"unknown mode {mode!r}")
PY
)
fi
git rev-parse -q --verify "refs/tags/v$next" >/dev/null && { echo "tag v$next already exists" >&2; exit 1; }
if [ "$mode" != "tag" ] && [ "$tagged" = "(not tagged)" ]; then
  echo "note: $current has no tag yet; 'scripts/bump-version.sh tag' tags it as is" >&2
fi

echo "branch:  main (up to date with origin)"
echo "current: $current $tagged"
echo "next:    $next"
echo "client:  @shhnote/client $(node -p "require('./package.json').dependencies['@shhnote/client']"), docs at $(tr -d ' \n\r' < .shhnote-ref)"
if [ "$yes" != "--yes" ]; then
  if [ "$mode" = "tag" ]; then
    read -r -p "Tag the current version as v$next? [y/N] " answer
  else
    read -r -p "Bump to $next, commit and tag v$next? [y/N] " answer
  fi
  case "$answer" in y|Y|yes) ;; *) echo "aborted"; exit 1;; esac
fi

# ---- write ---------------------------------------------------------------------------
if [ "$next" != "$current" ]; then
  # Writes package.json and both version fields of package-lock.json; no commit, no tag.
  npm version "$next" --no-git-tag-version --no-workspaces-update --silent >/dev/null
fi

git add package.json package-lock.json
git --no-pager diff --cached --stat
# -S forces a signature and fails if no signing key is configured in this environment
# (commit.gpgsign alone is silently skipped where it is unset).
if git diff --cached --quiet; then
  echo "(files already at $next; nothing to commit)"
else
  git commit --quiet -S -m "release: $next"
fi
git tag -s "v$next" -m "v$next"
git verify-commit HEAD >/dev/null 2>&1 || { echo "HEAD is not signed; check user.signingkey here" >&2; exit 1; }
git verify-tag "v$next" >/dev/null 2>&1 || { echo "tag is not signed; check user.signingkey here" >&2; exit 1; }
echo
echo "committed and tagged v$next (both signed). Push with:"
echo "  git push origin main --follow-tags"
