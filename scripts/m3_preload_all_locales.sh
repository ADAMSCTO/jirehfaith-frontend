#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

# Patch src/lib/i18n.ts so preloadCurrentLang() also preloads the other locales (EN/ES/FR/PT).
# This avoids any timing/race issues when switching languages in-app.

# Make a backup
cp src/lib/i18n.ts src/lib/i18n.ts.bak.$(date +%s)

# Replace the body of preloadCurrentLang with an "eager preload" of all locales.
# We keep the current language first, then preload the others in parallel.
awk '
  BEGIN { in_fn=0 }
  /export[[:space:]]+async[[:space:]]+function[[:space:]]+preloadCurrentLang[[:space:]]*\(\)[[:space:]]*{/ {
    print; 
    print "  // Eagerly preload current language + all supported locales to avoid race conditions";
    print "  const L = getLang();";
    print "  await ensureLocale(L);";
    print "  const others = [\"en\",\"es\",\"fr\",\"pt\"].filter(x => x !== L);";
    print "  await Promise.allSettled(others.map((x) => ensureLocale(x)));";
    # Skip original body until closing brace of this function
    in_fn=1; next
  }
  in_fn && /}/ { 
    print; in_fn=0; next 
  }
  !in_fn { print }
' src/lib/i18n.ts > src/lib/i18n.ts.tmp && mv src/lib/i18n.ts.tmp src/lib/i18n.ts

echo "Patched: preloadCurrentLang() now loads EN/ES/FR/PT eagerly."
