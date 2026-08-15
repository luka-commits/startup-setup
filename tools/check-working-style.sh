#!/usr/bin/env bash
# Is the working-style block in your global CLAUDE.md still current?
#
#   bash tools/check-working-style.sh
#
# Says one of three things: not installed, behind the package, or current.
# Reads only. Changes nothing.

set -u

paket="$(cd "$(dirname "$0")/.." && pwd)/reference/working-style.md"
global="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/CLAUDE.md"

version_aus() {
  grep -o 'BEGIN working-style v[0-9.]*' "$1" 2>/dev/null | head -1 | sed 's/.*v//'
}

if [ ! -f "$paket" ]; then
  echo "Package file missing: $paket"
  exit 1
fi

paket_v="$(version_aus "$paket")"

if [ ! -f "$global" ]; then
  echo "No global CLAUDE.md at $global"
  echo "The package has working-style v$paket_v. See reference/working-style.md for how to install it."
  exit 2
fi

global_v="$(version_aus "$global")"

if [ -z "$global_v" ]; then
  echo "Your global CLAUDE.md has no working-style block."
  echo "The package has v$paket_v. See reference/working-style.md for how to install it."
  exit 2
fi

if [ "$global_v" = "$paket_v" ]; then
  # Same version is not the same text: a hand-edit in the global copy drifts silently.
  if diff -q <(sed -n '/BEGIN working-style/,/END working-style/p' "$paket") \
             <(sed -n '/BEGIN working-style/,/END working-style/p' "$global") >/dev/null 2>&1; then
    echo "working-style v$global_v — current, and identical to the package."
    exit 0
  fi
  echo "working-style v$global_v — same version, but the text differs from the package."
  echo "Either your copy was edited by hand, or the package changed without a version bump."
  echo "Compare: diff <(sed -n '/BEGIN working-style/,/END working-style/p' '$paket') \\"
  echo "              <(sed -n '/BEGIN working-style/,/END working-style/p' '$global')"
  exit 3
fi

echo "working-style v$global_v installed, package has v$paket_v."
echo "See § Changes in reference/working-style.md for what changed, then replace the block."
exit 3
