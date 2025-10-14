#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

# 1) Insert sectionLabel() before STOPGAP_EMOTIONS if it doesn't exist
if ! grep -q "function sectionLabel(title: string, lang: Lang)" src/app/page.tsx; then
  awk '
    BEGIN{inserted=0}
    /const STOPGAP_EMOTIONS = \[/ && !inserted {
      print "/** Localized ACTS-Y section titles */";
      print "function sectionLabel(title: string, lang: Lang): string {";
      print "  const raw = String(title || \"\");";
      print "  const key = raw.toLowerCase().replace(/[\\\\s\\/-]+/g, \"_\");";
      print "  const map: Record<string,string> = {";
      print "    \"adoration\": \"acts.adoration\",";
      print "    \"confession\": \"acts.confession\",";
      print "    \"thanksgiving\": \"acts.thanksgiving\",";
      print "    \"supplication\": \"acts.supplication\",";
      print "    \"yielding\": \"acts.yielding\",";
      print "    \"yielding_listening\": \"acts.yielding_listening\"";
      print "  };";
      print "  const tkey = map[key];";
      print "  if (tkey) {";
      print "    const val = t(tkey, lang);";
      print "    if (val !== tkey) return val;";
      print "  }";
      print "  return raw ? raw.replace(/[_-]+/g, \" \").replace(/\\b\\w/g, (m) => m.toUpperCase()) : raw;";
      print "}";
      print "";
      inserted=1;
    }
    { print }
  ' src/app/page.tsx > src/app/page.tsx.tmp && mv src/app/page.tsx.tmp src/app/page.tsx
  echo "Inserted sectionLabel() helper."
fi

# 2) Replace visible section titles in render
sed -i 's/{prettyTitle(String(s.title))}/{sectionLabel(String(s.title), lang)}/' src/app/page.tsx

# 3) Replace any places where we build text with the section title (copy, prayerBase)
sed -i 's/\${prettyTitle(String(s.title))}\\n\${s.content}/\${sectionLabel(String(s.title), lang)}\\n\${s.content}/g' src/app/page.tsx

echo "Patched: ACTS-Y titles now localized via sectionLabel()."
