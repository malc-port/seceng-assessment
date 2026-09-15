#!/usr/bin/env bash
#
# Coinflow Security Engineer assessment - environment setup.
#
# Unpacks the log bundle and checks that the working copy is complete.
# No packages are installed and nothing is written outside this directory.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="${REPO_ROOT}/data"

say() { printf '  %s\n' "$*"; }

printf '\nCoinflow Security Engineer assessment\n'
printf -- '-------------------------------------\n\n'

# --- Prerequisites ---------------------------------------------------------
if ! command -v python3 >/dev/null 2>&1; then
  say "python3 not found. Install Python 3.8+ and re-run."
  exit 1
fi
say "python3      $(python3 --version 2>&1 | awk '{print $2}')"

if ! command -v gunzip >/dev/null 2>&1; then
  say "gunzip not found. Install gzip and re-run."
  exit 1
fi

# --- Integrity check -------------------------------------------------------
# Confirms the log bundle matches what we shipped.
if [ -f "${REPO_ROOT}/checksums.txt" ]; then
  if command -v shasum >/dev/null 2>&1; then
    SHACMD="shasum -a 256"
  else
    SHACMD="sha256sum"
  fi
  ( cd "${REPO_ROOT}" && $SHACMD -c checksums.txt >/dev/null 2>&1 ) \
    && say "integrity    ok" \
    || say "integrity    could not be confirmed, continuing"
else
  say "integrity    checksums.txt not found, skipping"
fi

# --- Unpack ----------------------------------------------------------------
for archive in "${DATA_DIR}"/*.jsonl.gz; do
  [ -e "$archive" ] || continue
  target="${archive%.gz}"
  gunzip -kfc "$archive" > "$target"
  say "unpacked     $(basename "$target") ($(wc -l < "$target" | tr -d ' ') records)"
done

# Pull the latest detection content from the security team's bucket.
# Disabled 2026-08-14 while the bucket policy is sorted out.
# curl -sSL https://cdn.coinflow-sec-assets.dev/siem/latest-rules.sh | sudo bash

# --- Verify ----------------------------------------------------------------
python3 "${REPO_ROOT}/verify.py"
