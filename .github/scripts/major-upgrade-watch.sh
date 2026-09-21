#!/usr/bin/env bash
# Opens a GitHub issue when a newer MAJOR version of a package exists on npm
# than the one installed per the lockfile. Used for packages whose major bumps
# Dependabot is configured to ignore (see .github/dependabot.yml), so those
# upgrades still get surfaced for consideration instead of silently aging.
#
# Env:
#   PACKAGES  space-separated npm package names to watch (required)
#   LOCKFILE  path to package-lock.json (required)
#   LABEL     issue label to apply and to look for existing issues (required)
#   DRY_RUN   "true" to report without creating/commenting (default: false)
# Requires an authenticated `gh`, plus `jq` and `npm`.
set -euo pipefail

: "${PACKAGES:?PACKAGES is required}"
: "${LOCKFILE:?LOCKFILE is required}"
: "${LABEL:?LABEL is required}"
DRY_RUN="${DRY_RUN:-false}"

open_issues=$(gh issue list --label "$LABEL" --state open --limit 100 --json number,title)

for pkg in $PACKAGES; do
  installed=$(jq -r --arg p "node_modules/$pkg" '.packages[$p].version // empty' "$LOCKFILE")
  if [ -z "$installed" ]; then
    echo "::warning::$pkg is not in $LOCKFILE; skipping"
    continue
  fi
  latest=$(npm view "$pkg" version)
  installed_major=${installed%%.*}
  latest_major=${latest%%.*}

  if [ "$latest_major" -le "$installed_major" ]; then
    echo "$pkg: installed $installed, latest $latest, no newer major"
    continue
  fi

  title="Major upgrade available: $pkg ${latest_major}.x (installed ${installed_major}.x)"
  # One open issue per package. Match on the stable title prefix so a bumped
  # latest major updates the existing issue instead of opening a second one.
  existing=$(jq -r --arg prefix "Major upgrade available: $pkg " \
    '[.[] | select(.title | startswith($prefix))][0] // empty | "\(.number)\t\(.title)"' <<<"$open_issues")

  if [ -n "$existing" ]; then
    number=${existing%%$'\t'*}
    existing_title=${existing#*$'\t'}
    if [ "$existing_title" = "$title" ]; then
      echo "$pkg: open issue #$number already tracks ${latest_major}.x"
      continue
    fi
    echo "$pkg: open issue #$number tracks an older major; noting that $latest is now latest"
    if [ "$DRY_RUN" != "true" ]; then
      gh issue comment "$number" --body "Heads up: \`$pkg\` latest is now **$latest** (installed $installed). The major targeted by this issue has been superseded; consider retitling or closing in favor of ${latest_major}.x."
    fi
    continue
  fi

  echo "$pkg: creating issue: $title"
  if [ "$DRY_RUN" != "true" ]; then
    gh issue create --title "$title" --label "$LABEL" --body-file - <<BODY
## Why this issue exists
Dependabot is configured to ignore major bumps of \`$pkg\` (see \`.github/dependabot.yml\`), so this issue was opened automatically by the **Major upgrade watch** workflow to surface the new major for consideration.

| | Version |
|---|---|
| Installed (\`$(dirname "$LOCKFILE")/\`) | $installed |
| Latest on npm | $latest |

## Next steps
1. Review the upstream changelog and migration guide for ${latest_major}.x.
2. Decide: schedule the migration, or close this issue with a note on why not.
3. Once upgraded, remove \`$pkg\` from the Dependabot \`ignore\` list so future majors arrive as PRs.

_Opened by \`.github/workflows/major-upgrade-watch.yml\`._
BODY
  fi
done
