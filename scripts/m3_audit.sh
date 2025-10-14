#!/usr/bin/env bash
set -euo pipefail

cd ~/jirehfaith-frontend

echo "=== Sanity: branch + status ==="
git rev-parse --abbrev-ref HEAD
git status -sb

echo
echo "=== i18n files present ==="
ls -la src/i18n || true
echo
sed -n '1,200p' src/i18n/en.json || true
echo
sed -n '1,200p' src/i18n/es.json 2>/dev/null || true
echo
sed -n '1,200p' src/i18n/fr.json || true
echo
sed -n '1,200p' src/i18n/pt.json || true

echo
echo "=== Search for hardcoded UI strings that must be localized ==="
# Header & page title
grep -RniE "Prayer Composer with The Holy Bible Scriptures" src || true

# Section titles & labels
grep -RniE "Prayer[\"'<]" src || true
grep -RniE "(Emotion|Compose prayer|No prayer yet|Copy|Clear)" src || true

# Any remaining 'situation' references in user-facing text (just in case)
grep -RniE "(state your condition|situation|condici|situa[cç][aã]o)" src || true

echo
echo "=== Check i18n usage helpers wired ==="
grep -RniE "(getLang|onLangChange|preloadCurrentLang|LanguageProvider)" src || true

echo
echo "=== DONE: m3 audit complete ==="
