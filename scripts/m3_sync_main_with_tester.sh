#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

FILE="src/app/page.tsx"

# 1) Ensure we import t and Lang (usually already present)
#    (no-op if already there)
sed -i 's@from "@/lib/i18n";@from "@/lib/i18n";@' "$FILE" || true

# 2) Add/replace robust sectionLabel helper (same as tester)
perl -0777 -pe 's|function sectionLabel\(title: string, lang: Lang\): string \{[\s\S]*?\}\s*|function sectionLabel(title: string, lang: Lang): string {\n  const raw = String(title || \"\");\n  const nfd = (raw as any).normalize ? raw.normalize(\"NFD\") : raw;\n  const lower = nfd.toLowerCase().replace(/[\\u0300-\\u036f]/g, \"\");\n  const cleaned = lower.replace(/[:\\.,;!\\?()\\[\\]{}]/g, \"\").replace(/\\s*\\/\\s*/g, \"/\").trim();\n  const key = cleaned.replace(/[\\/\\-\\s]+/g, \"_\");\n  const map: Record<string, string> = {\n    adoration: \"acts.adoration\",\n    confession: \"acts.confession\",\n    thanksgiving: \"acts.thanksgiving\",\n    supplication: \"acts.supplication\",\n    yielding: \"acts.yielding\",\n    yielding_listening: \"acts.yielding_listening\",\n  };\n  let tkey = map[key];\n  if (!tkey) {\n    const rawTrim = raw.replace(/[:\\s]+$/, \"\").trim();\n    const rawLc = rawTrim.toLowerCase();\n    if (rawLc === \"adoration\") tkey = \"acts.adoration\";\n    else if (rawLc === \"confession\") tkey = \"acts.confession\";\n    else if (rawLc === \"thanksgiving\") tkey = \"acts.thanksgiving\";\n    else if (rawLc === \"supplication\") tkey = \"acts.supplication\";\n    else if (rawLc === \"yielding\") tkey = \"acts.yielding\";\n  }\n  if (tkey) {\n    const val = t(tkey, lang);\n    if (val !== tkey) return val;\n  }\n  return raw ? raw.replace(/[_-]+/g, \" \").replace(/\\b\\w/g, (m) => m.toUpperCase()) : raw;\n}\n|s' -i "$FILE" || true

# If the helper doesn’t exist, insert it before STOPGAP_EMOTIONS
awk '\nBEGIN{inserted=0}\n/const STOPGAP_EMOTIONS = \\[/ && !inserted {\n  print \"/** Localized ACTS-Y section titles (robust) */\";\n  print \"function sectionLabel(title: string, lang: Lang): string {\";\n  print \"  const raw = String(title || \\\"\\\");\";\n  print \"  const nfd = (raw as any).normalize ? raw.normalize(\\\"NFD\\\") : raw;\";\n  print \"  const lower = nfd.toLowerCase().replace(/[\\\\u0300-\\\\u036f]/g, \\\"\\\");\";\n  print \"  const cleaned = lower.replace(/[:\\\\.,;!\\\\?()\\\\[\\\\]{}]/g, \\\"\\\").replace(/\\\\s*\\\\/\\\\s*/g, \\\"/\\\").trim();\";\n  print \"  const key = cleaned.replace(/[\\\\/\\\\-\\\\s]+/g, \\\"_\\\");\";\n  print \"  const map: Record<string,string> = {\";\n  print \"    adoration: \\\"acts.adoration\\\",\";\n  print \"    confession: \\\"acts.confession\\\",\";\n  print \"    thanksgiving: \\\"acts.thanksgiving\\\",\";\n  print \"    supplication: \\\"acts.supplication\\\",\";\n  print \"    yielding: \\\"acts.yielding\\\",\";\n  print \"    yielding_listening: \\\"acts.yielding_listening\\\",\";\n  print \"  };\";\n  print \"  let tkey = map[key];\";\n  print \"  if (!tkey) { const rawTrim = raw.replace(/[:\\\\s]+$/, \\\"\\\").trim(); const rawLc = rawTrim.toLowerCase(); if (rawLc === \\\"adoration\\\") tkey = \\\"acts.adoration\\\"; else if (rawLc === \\\"confession\\\") tkey = \\\"acts.confession\\\"; else if (rawLc === \\\"thanksgiving\\\") tkey = \\\"acts.thanksgiving\\\"; else if (rawLc === \\\"supplication\\\") tkey = \\\"acts.supplication\\\"; else if (rawLc === \\\"yielding\\\") tkey = \\\"acts.yielding\\\"; }\";\n  print \"  if (tkey) { const val = t(tkey, lang); if (val !== tkey) return val; }\";\n  print \"  return raw ? raw.replace(/[_-]+/g, \\\" \\\").replace(/\\\\b\\\\w/g, (m) => m.toUpperCase()) : raw;\";\n  print \"}\";\n  print \"\";\n  inserted=1;\n}\n{ print }\n' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"

# 3) Use sectionLabel when rendering visible titles
sed -i 's/{prettyTitle(String(s.title))}/{sectionLabel(String(s.title), lang)}/' "$FILE" || true

# 4) Use sectionLabel in the text that gets copied (template literals)
perl -0777 -pe 's/`\\$\\{prettyTitle\\(String\\(s\\.title\\)\\)\\}\\\\n\\$\\{s\\.content\\}`/`\\$\\{sectionLabel(String(s.title), lang)\\}\\\\n\\$\\{s.content\\}`/g' -i "$FILE" || true

echo "Synced main page with tester mapping."
